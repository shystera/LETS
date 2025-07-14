// /netlify/functions/createUploadUrl.js
const { Mux } = require('@mux/mux-node');

const mux = new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET
);

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const upload = await mux.video.uploads.create({
      new_asset_settings: { playback_policy: 'public' },
      playback_policy: 'public'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: upload.url }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};