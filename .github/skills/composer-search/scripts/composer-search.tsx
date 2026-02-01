import 'dotenv/config';
import { AzureKeyCredential } from '@azure/search-documents';

import {
    KnowledgeRetrievalClient,
} from '@azure/search-documents';

const credential = new AzureKeyCredential(process.env.AZURE_SEARCH_API_KEY!);


const knowledgeRetrievalClient = new KnowledgeRetrievalClient(
    process.env.AZURE_SEARCH_ENDPOINT!,
    'shadow-knowledge-base',
    credential
);

const query1 = `What is Challenger`;
const MAX_CHUNKS = 3;

const retrievalRequest = {
    messages: [
        {
            role: "user",
            content: [
                {
                    type: "text" as const,
                    text: query1
                }
            ]
        }
    ],
    includeActivity: true,
    retrievalReasoningEffort: { kind: "low" as const }
};

const result = await knowledgeRetrievalClient.retrieveKnowledge(retrievalRequest);

// Extract the knowledge sources used from activities
const sourcesUsed = new Set<string>();
if (result.activity) {
    result.activity.forEach((activity: any) => {
        if (activity.knowledgeSourceName) {
            sourcesUsed.add(activity.knowledgeSourceName);
        }
    });
}
const sourceLabel = sourcesUsed.size > 0 ? [...sourcesUsed].join(', ') : 'shadow-knowledge-base';

console.log("\n📝 ANSWER:");
console.log("─".repeat(80));
let chunkCount = 0;
if (result.response && result.response.length > 0) {
    result.response.forEach((msg) => {
        if (msg.content && msg.content.length > 0) {
            msg.content.forEach((content) => {
                if (content.type === "text" && 'text' in content) {
                    // Parse the JSON content and extract just the "content" field
                    try {
                        const parsed = JSON.parse(content.text as string);
                        if (Array.isArray(parsed)) {
                            parsed.slice(0, MAX_CHUNKS).forEach((item: any) => {
                                if (item.content) {
                                    console.log(item.content);
                                    console.log(`\x1b[32m✓\x1b[0m ${sourceLabel}`);
                                    console.log("");
                                    chunkCount++;
                                }
                            });
                        } else {
                            console.log(content.text);
                            console.log(`\x1b[32m✓\x1b[0m ${sourceLabel}`);
                        }
                    } catch {
                        // If not JSON, print as-is
                        console.log(content.text);
                        console.log(`\x1b[32m✓\x1b[0m ${sourceLabel}`);
                    }
                }
            });
        }
    });
}
console.log("─".repeat(80));