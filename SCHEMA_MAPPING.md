# Data Schema Mapping Reference

This document ensures consistency across all data transformations in the ScreenFlow application.

**NOTE: The application now uses the exact IDs (analysisId and step.id) provided by the external automation API, rather than generating its own.**

## 1. API Event Schema (SSE from Automation Service)
```typescript
interface ProjectEvent {
  step?: {
    id: string;
    analysisId: string;
    stepNumber: number;
    stepStatus: 'pending' | 'completed' | 'failed' | 'needs_retry';
    screenshotPath?: string;  // camelCase
    pageData?: any;
    action: string;
    result?: any;
    args: any;
    analysis?: {
      stepDescription?: string;    // API uses stepDescription
      pageDescription?: string;
      actionIntent?: string;
      actionReasoning?: string;
    };
    timestamp: string;
    completedAt?: string;
    error?: string;
  };
}
```

## 2. Client Type Schema (Frontend TypeScript)
```typescript
interface Step {
  timestamp: string;
  id: string;
  analysisId: string;
  stepNumber: number;
  action: string;
  screenshot_path?: string;         // snake_case
  stepStatus: 'pending' | 'completed' | 'failed' | 'needs_retry';
  args: any;
  analysis?: {
    description?: string;           // Client uses description (not stepDescription)
    pageDescription?: string;
    actionIntent?: string;
    actionReasoning?: string;
  };
  result?: any;
  completedAt?: string;
  error?: string;
}
```

## 3. Database Schema (Prisma/PostgreSQL)
```prisma
model Step {
  id           String    @id @default(cuid())
  analysisId   String    @map("analysis_id")
  stepNumber   Int       @map("step_number")
  action       String
  stepStatus   String    @default("pending") @map("step_status")
  args         Json?
  analysisData Json?     @map("analysis_data")     -- JSON field stores analysis object
  result       Json?
  timestamp    DateTime  @default(now())
  completedAt  DateTime? @map("completed_at")
  error        String?
  screenshotPath String? @map("screenshot_path")   -- Field: screenshotPath, Column: screenshot_path
}
```

## 4. Screenshot Path Flow (CRITICAL)
```typescript
// CORRECTED: Direct URL usage (Supabase storage)

// 1. Database stores: "https://supabase.co/storage/v1/object/sign/screenshots/project_id/step_1.jpg?token=..."
// 2. Client receives: { screenshot_path: "https://supabase.co/storage/v1/object/sign/screenshots/..." }
// 3. Frontend uses URL directly: getScreenshotPath(step.screenshot_path)
//    - Returns: The complete URL as-is (no extraction needed)
// 4. Image displays: <img src="https://supabase.co/storage/..." /> (Direct from Supabase)

function getScreenshotPath(screenshotUrl: string | undefined): string | null {
  if (!screenshotUrl) return null;
  // Return the URL directly - it's already a complete signed URL from Supabase
  return screenshotUrl;
}
```

## 5. Data Flow Transformations

### A. SSE Event → Client Save API Request
**In useProjectEvents.ts saveStepToDatabase():**
```typescript
// API Event data → Client API request
{
  id: stepData.id,
  analysisId: stepData.analysisId,
  stepNumber: stepData.stepNumber,
  action: stepData.action,
  timestamp: stepData.timestamp,
  screenshot_path: stepData.screenshotPath,           // camelCase → snake_case
  stepStatus: stepData.stepStatus,                    // Same field name
  args: stepData.args,
  analysis: {
    description: stepData.analysis?.stepDescription,  // stepDescription → description
    pageDescription: stepData.analysis?.pageDescription,
    actionIntent: stepData.analysis?.actionIntent,
    actionReasoning: stepData.analysis?.actionReasoning
  },
  result: stepData.result,
  completedAt: stepData.completedAt || new Date().toISOString(),
  error: stepData.error
}
```

### B. Client API Request → Database
**In saveStep/route.ts:**
```typescript
// Client request → Database record
const stepData = {
  id: step.id || `step_${projectId}_${step.stepNumber}`,
  analysisId: analysis.id,
  stepNumber: step.stepNumber,
  action: step.action,
  stepStatus: step.stepStatus || 'completed',         // Same field name
  args: step.args || null,
  analysisData: step.analysis || null,                // analysis → analysisData
  result: step.result || null,
  screenshotPath: step.screenshot_path || null,       // snake_case → camelCase
  error: step.error || null,
  timestamp: step.timestamp ? new Date(step.timestamp) : new Date(),
  ...(step.stepStatus === 'completed' && { completedAt: new Date() })
};
```

### C. Database → Client Response
**In database.ts convertPrismaStep():**
```typescript
// Database record → Client type
return {
  timestamp: prismaStep.timestamp.toISOString(),
  id: prismaStep.id,
  analysisId: prismaStep.analysisId,
  stepNumber: prismaStep.stepNumber,
  action: prismaStep.action,
  screenshot_path: prismaStep.screenshotPath,          // camelCase → snake_case
  stepStatus: prismaStep.stepStatus,
  args: prismaStep.args,
  analysis: prismaStep.analysisData,                   // analysisData → analysis (JSON preserved)
  result: prismaStep.result,
  completedAt: prismaStep.completedAt?.toISOString(),
  error: prismaStep.error
};
```

## 6. Key Mapping Rules

| Source | Target | Field Mapping |
|--------|--------|---------------|
| API Event | Client API | `screenshotPath` → `screenshot_path` |
| API Event | Client API | `analysis.stepDescription` → `analysis.description` |
| Client API | Database | `screenshot_path` → `screenshotPath` |
| Client API | Database | `analysis` → `analysisData` |
| Database | Client Type | `screenshotPath` → `screenshot_path` |
| Database | Client Type | `analysisData` → `analysis` |
| **Frontend Display** | **Direct Usage** | `screenshot_path` → **Use URL directly (no transformation)** |

**Note:** The Prisma model uses camelCase field names (`screenshotPath`, `analysisData`) which map to snake_case database columns via `@map()` directives.

**IMPORTANT:** Screenshots are served directly from Supabase storage using signed URLs. No local API route needed.

## 7. Validation Checklist

- ✅ API Event interface matches actual SSE data structure
- ✅ Client type interface matches frontend expectations  
- ✅ Database schema matches Prisma model
- ✅ SSE → Client API transformation handles field name changes
- ✅ Client API → Database transformation handles field name changes
- ✅ Database → Client transformation handles field name changes
- ✅ All analysis object structures are preserved through JSON fields
- ✅ Screenshot URLs are used directly from Supabase storage (no local serving needed)
