const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const app = express();
require('dotenv').config();

const whitelist = [process.env.CLIENT_URL, '*'];
const nodeENV = process.env.NODE_ENV || 'development';
const port = Number(process.env.API_PORT) || 3000;

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

app.post('/api/gpt-responce', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body' });
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
      model: 'gpt-4.1',
      stream: true,
      input: `Here's user's prompt: ${prompt}. Please generate response as Markdown (not as code, just as markdown string), structure it not make text more readable. Do not include senteces line 'Here’s a well-structured Markdown response', just include the markdown itself`,
      tools: [
        {
          type: 'mcp',
          require_approval: 'never',
          server_label: mcpServerLabel,
          server_url: mcpServerUrl,
        },
      ],
    });

    // As chunks arrive, forward them as SSE 'data:' events
    for await (const chunk of stream) {
      const type = chunk.type;
      const content = chunk.delta;
      // console.log({ chunk: JSON.stringify(chunk), content });
      if (type === 'response.output_text.delta' && content) {
        res.write(`data: ${content.replace(/\n/g, '\\n')}\n\n`);
      }
    }
    // Signal end of stream
    res.write(`event: done\ndata: [DONE]\n\n`);
    res.end();
  } catch (err) {
    console.log(err);
    console.error('Error streaming from OpenAI:', err);
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
