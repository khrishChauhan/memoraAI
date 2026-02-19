/**
 * MemoraAI - RunAnywhere AI Module
 *
 * Handles SDK initialization, model registration, download, and text generation.
 * Uses @runanywhere/core + @runanywhere/llamacpp for on-device LLM inference.
 */

import { RunAnywhere, SDKEnvironment } from '@runanywhere/core';
import { LlamaCPP } from '@runanywhere/llamacpp';

// ============================================================================
// Constants
// ============================================================================

const MODEL_ID = 'SmolLM2-360M.Q8_0';
const MODEL_NAME = 'SmolLM2 360M Q8_0';
const MODEL_URL =
    'https://huggingface.co/prithivMLmods/SmolLM2-360M-GGUF/resolve/main/SmolLM2-360M.Q8_0.gguf';
const MODEL_MEMORY = 500_000_000; // ~500MB

// ============================================================================
// State
// ============================================================================

let isInitialized = false;
let isModelReady = false;

// ============================================================================
// Status callback type
// ============================================================================

export type StatusCallback = (status: string) => void;

// ============================================================================
// Initialize RunAnywhere SDK + LlamaCPP backend
// ============================================================================

export async function initializeAI(onStatus?: StatusCallback): Promise<void> {
    if (isInitialized) {
        onStatus?.('AI already initialized');
        console.log('[MemoraAI] SDK already initialized, skipping.');
        return;
    }

    try {
        // Step 1: Initialize core SDK in development mode (no API key needed)
        onStatus?.('Initializing SDK...');
        console.log('[MemoraAI] Initializing RunAnywhere SDK...');
        await RunAnywhere.initialize({
            environment: SDKEnvironment.Development,
        });
        console.log('[MemoraAI] SDK initialized.');

        // Step 2: Register LlamaCPP backend
        onStatus?.('Registering LlamaCPP backend...');
        console.log('[MemoraAI] Registering LlamaCPP backend...');
        LlamaCPP.register();
        console.log('[MemoraAI] LlamaCPP registered.');

        // Step 3: Add SmolLM2 model to registry
        onStatus?.('Registering model...');
        console.log('[MemoraAI] Adding SmolLM2 model...');
        await LlamaCPP.addModel({
            id: MODEL_ID,
            name: MODEL_NAME,
            url: MODEL_URL,
            memoryRequirement: MODEL_MEMORY,
        });
        console.log('[MemoraAI] Model registered.');

        isInitialized = true;
        onStatus?.('SDK ready');
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error('[MemoraAI] Initialization failed:', msg);
        onStatus?.(`Init failed: ${msg}`);
        throw error;
    }
}

// ============================================================================
// Download + Load model
// ============================================================================

export async function prepareModel(onStatus?: StatusCallback): Promise<void> {
    if (isModelReady) {
        onStatus?.('Model already loaded');
        console.log('[MemoraAI] Model already loaded, skipping.');
        return;
    }

    try {
        // Check if already downloaded
        const downloaded = await RunAnywhere.isModelDownloaded(MODEL_ID);

        if (!downloaded) {
            onStatus?.('Downloading model (~400MB)...');
            console.log('[MemoraAI] Downloading model...');
            await RunAnywhere.downloadModel(MODEL_ID, (progress) => {
                const pct = Math.round(progress.progress * 100);
                onStatus?.(`Downloading model... ${pct}%`);
                if (pct % 10 === 0) {
                    console.log(`[MemoraAI] Download progress: ${pct}%`);
                }
            });
            console.log('[MemoraAI] Download complete.');
        } else {
            onStatus?.('Model already downloaded');
            console.log('[MemoraAI] Model already on disk.');
        }

        // Load model into memory
        onStatus?.('Loading model into memory...');
        console.log('[MemoraAI] Loading model...');
        await RunAnywhere.loadModel(MODEL_ID);
        console.log('[MemoraAI] Model loaded and ready.');

        isModelReady = true;
        onStatus?.('Model ready');
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error('[MemoraAI] Model preparation failed:', msg);
        onStatus?.(`Model failed: ${msg}`);
        throw error;
    }
}

// ============================================================================
// Test AI chat
// ============================================================================

export async function testAI(onStatus?: StatusCallback): Promise<string> {
    try {
        onStatus?.('Thinking...');
        console.log('[MemoraAI] Sending test prompt...');

        const response = await RunAnywhere.chat(
            'Say hello and confirm you are running locally on this device.'
        );

        console.log('[MemoraAI] AI Response:', response);
        onStatus?.('Response received');
        return response;
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error('[MemoraAI] Chat failed:', msg);
        onStatus?.(`Chat failed: ${msg}`);
        throw error;
    }
}

// ============================================================================
// Full test pipeline: init → prepare → chat
// ============================================================================

export async function runFullTest(onStatus?: StatusCallback): Promise<string> {
    await initializeAI(onStatus);
    await prepareModel(onStatus);
    return await testAI(onStatus);
}

// ============================================================================
// Generate Chat Response
// ============================================================================

export async function generateResponse(
    prompt: string,
    onStatus?: StatusCallback
): Promise<string> {
    try {
        if (!isInitialized) {
            await initializeAI(onStatus);
        }
        if (!isModelReady) {
            await prepareModel(onStatus);
        }

        console.log('[MemoraAI] Generating response for:', prompt);
        // Using chat API
        const response = await RunAnywhere.chat(prompt);
        console.log('[MemoraAI] Generated:', response);
        return response;
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error('[MemoraAI] Generation failed:', msg);
        throw error;
    }
}

// ============================================================================
// Status getters
// ============================================================================

export function isAIInitialized(): boolean {
    return isInitialized;
}

export function isAIModelReady(): boolean {
    return isModelReady;
}
