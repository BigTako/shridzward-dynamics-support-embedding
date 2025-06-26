const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const app = express();
require('dotenv').config();

const whitelist = [process.env.CLIENT_URL, '*'];
const nodeENV = process.env.NODE_ENV || 'development';
const port = Number(process.env.API_PORT) || 3000;

const assistantInstruction = `
        You are a support agent bot of Shridzward Dynamics company support chat. Please act as a polite support agent. Do not loose the formal style but be pretty humane. Also during discussion with client please follow instructions below:
        If nothing if found to answer user's question, YOU MUST:
        1. CALL_TOOL search-withing-support-archieve({ question }) to lookup previous support agent answers contain required information.If nothing is found in previous support answers, please:
          a. CALL_TOOL save_question({ question }) make a base of unanswered questions. This will help support agents to adjust company MCP knowledge_base. Then propose user to chat with human agent. User should give an answer in the next message.
          i. If user answer is positive(so user wants to chat with agent) 1. Grab username from chat context(username), summarize the chat context itself(context) and get the EXACT user question(question). 2. CALL_TOOL redirect_to_support({ question, username, context }) 3. You will receive the whole information from created chat, grab only chat.id and return it as a string message response (ONLY chat.id, nothing else).
          ii. If user answer is negative, say something like: "Ok, thank you for your time! We are very sorry about this, we will improve our knowledge base to be able to answer next time!"
        Please, DO NOT make up information about the company, if you don't know something - act on the instructions above.
      `;

const configurePrompt = (prompt) =>
  `Here's user's prompt: ${prompt}. Please generate response as Markdown (not as code, just as markdown string), structure it not make text more readable. Do not include senteces line 'Here’s a well-structured Markdown response', just include the markdown itself`;

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
  const { prompt } = req.body;

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
      model: 'gpt-4o',
      stream: false,
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
        previous_response_id: response?.id,
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
  const { prompt } = req.body;

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
