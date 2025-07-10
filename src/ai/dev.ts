import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-code.ts';
import '@/ai/flows/explain-code.ts';
import '@/ai/flows/convert-code.ts';
import '@/ai/flows/detect-language.ts';
