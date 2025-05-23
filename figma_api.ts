import axios from "axios";

function getFigmaApiKey() {
  const apiKey = process.env.FIGMA_API_KEY;
  if (!apiKey) {
    throw new Error("FIGMA_API_KEY is not set");
  }
  return apiKey;
}

export function parseKeyFromUrl(url: string) {
  // Extract key from URLs like:
  // https://www.figma.com/board/vJzJ1oVCzowAKAayQJx6Ug/...
  // https://www.figma.com/design/8SvxepW26v4d0AyyTAw23c/...
  // https://www.figma.com/file/8SvxepW26v4d0AyyTAw23c/...
  const matches = url.match(/figma\.com\/(board|design|file)\/([^/?]+)/);
  if (matches) {
    return matches[2]; // Return the second capture group which contains the key
  }
  throw new Error("Could not parse Figma key from URL");
}

type FigNode = {
  id: string;
  name: string;
  type: string;
  children?: FigNode[];
};

type FigFile = {
  name: string;
  version: string;
  document: FigNode;
  thumbnailUrl: string;
  thumbnailB64: string;
};

export function getCanvasIds(figFileJson: FigNode) {
  const canvasIds: string[] = [];
  const queue: FigNode[] = [figFileJson];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node.type === "CANVAS") {
      canvasIds.push(node.id);
      continue; // Skip children of canvases
    }
    if (node.children) {
      queue.push(...node.children);
    }
  }
  return canvasIds;
}

export async function downloadFigmaFile(key: string): Promise<FigFile> {
  const response = await axios.get(`https://api.figma.com/v1/files/${key}`, {
    headers: {
      "X-FIGMA-TOKEN": getFigmaApiKey(),
    },
  });
  const data = response.data;
  return {
    ...data,
    thumbnailB64: await imageUrlToBase64(data.thumbnailUrl),
  };
}

export async function getThumbnails(key: string, ids: string[]): Promise<{ [id: string]: string }> {
  const response = await axios.get(
    `https://api.figma.com/v1/images/${key}?ids=${ids.join(",")}&format=png&page_size=1`,
    {
      headers: {
        "X-FIGMA-TOKEN": getFigmaApiKey(),
      },
    }
  );
  const data = response.data as { images: { [id: string]: string }; err?: string };
  if (data.err) {
    throw new Error(`Error getting thumbnails: ${data.err}`);
  }
  return data.images;
}

export async function getThumbnailsOfCanvases(
  key: string,
  document: FigNode
): Promise<{ id: string; url: string; b64: string }[]> {
  const canvasIds = getCanvasIds(document);
  const thumbnails = await getThumbnails(key, canvasIds);
  const results = [];
  for (const [id, url] of Object.entries(thumbnails)) {
    results.push({
      id,
      url,
      b64: await imageUrlToBase64(url),
    });
  }
  return results;
}

export async function readComments(fileKey: string) {
  const response = await axios.get(`https://api.figma.com/v1/files/${fileKey}/comments`, {
    headers: {
      "X-FIGMA-TOKEN": getFigmaApiKey(),
    },
  });
  return response.data;
}

export async function postComment(
  fileKey: string,
  message: string,
  x: number,
  y: number,
  nodeId?: string
) {
  const response = await axios.post(
    `https://api.figma.com/v1/files/${fileKey}/comments`,
    {
      message,
      client_meta: { node_offset: { x, y }, node_id: nodeId },
    },
    {
      headers: {
        "X-FIGMA-TOKEN": getFigmaApiKey(),
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

export async function replyToComment(fileKey: string, commentId: string, message: string) {
  const response = await axios.post(
    `https://api.figma.com/v1/files/${fileKey}/comments`,
    {
      message,
      comment_id: commentId,
    },
    {
      headers: {
        "X-FIGMA-TOKEN": getFigmaApiKey(),
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

async function imageUrlToBase64(url: string) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data).toString("base64");
}
