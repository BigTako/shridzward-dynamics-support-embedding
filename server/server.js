const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const app = express();
require('dotenv').config();

const whitelist = [process.env.CLIENT_URL, '*'];
const nodeENV = process.env.NODE_ENV || 'development';
const port = Number(process.env.API_PORT) || 3000;

const assistantInstruction = `
        You are Shridzward Dynamics technical support. You have five functions you may invoke—never answer directly if a function exists for your need.  Follow these steps in order:

        1. ALWAYS call get_knowledge() first to try to answer the user’s question with company info.  
          - If get_knowledge() returns non-empty data, interpret it and RESPOND in plain-language.  
          - If it returns empty / “no match,” go to step 2.

        2. If the user’s question pertains to any product details (inventory counts, delivery availability, weight, delivery dates, “where can we ship,” etc.), ALWAYS call get_products_data().  
          - If it returns data that directly addresses the question, RESPOND in plain-language using that data.  
          - If it cannot (e.g. product not found, or notes say “no delivery to that region”), RESPOND _with the exact restriction_ from the data.  
          - If it still can’t answer, go to step 3.

        3. ALWAYS call search-within-support-archive().  
          - If it returns relevant past dialog, RESPOND with a concise summary of that resolution.  
          - If it returns nothing useful, go to step 4.

        4. YOU MUST call save_question({"question": USER_QUESTION}).  
          Then RESPOND exactly:
          “I’m sorry, I don’t have that information at the moment. You can switch to a human agent by clicking ‘Switch to human agent’ below—please let me know how you’d like to be addressed before you do.”

        5. In ANY other situation where you cannot find an answer to user question:
            a. If client already mentioned his/her name RESPOND exactly:
              “I’m sorry, I don’t have that information at the moment. You can switch to a human agent by clicking ‘Switch to human agent’.”
            b. If client didn't RESPOND exactly:: 
              “I’m sorry, I don’t have that information at the moment. You can switch to a human agent by clicking ‘Switch to human agent’ below—please let me know how you’d like to be addressed before you do.”
        6. If user wants to contact with support, RESPOND exactly "You can switch to a human agent by clicking ‘Switch to human agent’ below." and provide company contacts.
**IMPORTANT:**  
- _Do not_ output any prose or partial answers until after you have successfully called a function.  
- _Do not_ guess or hallucinate.  
- _Do not_ call save_question or redirect_to_support until you have exhausted the three lookup steps.  
- All tool calls must be the **only content** of that response (no extra JSON, no commentary).  
- _Do not_ generate you own suggestions! If you don't know something - call MCP tools to get additional information or notify client explicitly that you can't do that.
      `;

const configurePrompt = (prompt) =>
  `Here's user's prompt: ${prompt}. Please generate response as Markdown (not as code, just as markdown string), 
    structure it not make text more readable. Do not include senteces line 'Here’s a well-structured Markdown response', 
    just include the markdown itself."
    `;

app.use(
  cors({
    origin:
      nodeENV === 'development'
        ? '*'
        : function (origin, callback) {
            console.log({ origin, whitelist });
            if (whitelist.indexOf(origin) !== -1) {
              callback(null, true);
            } else {
              callback(new Error('Not allowed by CORS'));
            }
          },
  })
);
app.use(express.json());

// SSE helper to set headers
function initSSE(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });
  res.flushHeaders();
}

app.post('/api/gpt-response', async (req, res) => {
  const { prompt, previous_response_id } = req.body;

  if (!prompt) {
    return res
      .status(400)
      .json({ status: 'error', error: 'Missing prompt in request body' });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  try {
    const mcpServerLabel = process.env.MCP_SERVER_LABEL;
    const mcpServerUrl = process.env.MCP_SERVER_URL;
    // Kick off a streaming completion with MCP tool
    const response = await openai.responses.create({
      model: 'o4-mini',
      stream: false,
      reasoning: { effort: 'medium' },
      previous_response_id,
      instructions: assistantInstruction,
      input: configurePrompt(prompt),
      tools: [
        {
          type: 'mcp',
          require_approval: 'never',
          server_label: mcpServerLabel,
          server_url: mcpServerUrl,
        },
        {
          type: 'file_search',
          vector_store_ids: [process.env.OPENAI_VECTOR_STORAGE_ID],
        },
      ],
    });

    const result = {
      status: 'success',
      _meta: {
        message: response?.output_text,
        response_id: response?.id,
      },
    };
    // console.log({ repsonce: JSON.stringify(response, undefined, 4) });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'error',
      error: `Error in getting response: ${err}`,
    });
  }
});

app.post('/api/gpt-response/sse', async (req, res) => {
  const { prompt, previous_response_id } = req.body;

  if (!prompt) {
    return res
      .status(400)
      .json({ status: 'error', error: 'Missing prompt in request body' });
  }

  // Initialize SSE headers
  initSSE(res);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  try {
    const mcpServerLabel = process.env.MCP_SERVER_LABEL;
    const mcpServerUrl = process.env.MCP_SERVER_URL;
    // Kick off a streaming completion with MCP tool
    const stream = await openai.responses.create({
      model: 'gpt-4o',
      stream: true,
      previous_response_id,
      instructions: assistantInstruction,
      input: configurePrompt(prompt),
      tools: [
        {
          type: 'mcp',
          require_approval: 'never',
          server_label: mcpServerLabel,
          server_url: mcpServerUrl,
        },
        {
          type: 'file_search',
          vector_store_ids: [process.env.OPENAI_VECTOR_STORAGE_ID],
        },
      ],
    });

    // As chunks arrive, forward them as SSE 'data:' events
    for await (const chunk of stream) {
      const content = chunk.delta;
      const type = chunk.type;
      // console.log({ chunk: JSON.stringify(chunk, undefined, 4), content });
      if (type === 'response.output_text.delta' && content) {
        res.write(`data: ${content.replace(/\n/g, '\\n')}\n\n`);
      } else if (type === 'response.completed') {
        const responseId = chunk.response.id;
        res.write(`event: done\ndata: ${responseId}\n\n`);
        res.end();
      }
    }
    // Signal end of stream
  } catch (err) {
    console.log('Error streaming from OpenAI:', err);
    // Notify client of error
    res.write(
      `event: error\ndata: ${JSON.stringify({ message: err.message })}\n\n`
    );
    res.end();
  }
});

app.listen(port, (error) => {
  if (error) {
    return console.log(`Failed to launch server: ${error}`);
  }
  console.log(`Example app listening on port ${port}`);
});
