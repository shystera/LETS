// /netlify/functions/createUploadUrl.js
const { Mux } = require('@mux/mux-node');

const mux = new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET
);

// Define CORS headers to be used in all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow requests from any origin
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async function(event, context) {
  // Handle preflight OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No Content
      headers: corsHeaders,
      body: '',
    };
  }

  // Restrict other methods, only POST is allowed
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: 'Method Not Allowed',
    };
  }

  try {
    const upload = await mux.video.uploads.create({
      // Set cors_origin to '*' to allow the browser to upload directly to Mux
      cors_origin: '*',
      new_asset_settings: { playback_policy: 'public' },
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ url: upload.url }),
    };
  } catch (error) {
    console.error('Error creating Mux upload URL:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to create upload URL.' }),
    };
  }
};
