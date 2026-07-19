export declare const WHATSAPP_24H_WINDOW_MS: number;
export declare const META_API_VERSION = "v21.0";
export declare const META_GRAPH_URL = "https://graph.facebook.com";
export declare const QUEUE_NAMES: {
    readonly SEND_MESSAGE: "send-message";
    readonly WEBHOOK_EVENTS: "webhook-events";
    readonly BROADCAST: "broadcast";
    readonly WORKFLOW: "workflow";
    readonly AI_SUGGESTION: "ai-suggestion";
    readonly WEBHOOK_DELIVERY: "webhook-delivery";
};
export declare const CHANNELS: {
    readonly WHATSAPP: "whatsapp";
    readonly INSTAGRAM: "instagram";
    readonly MESSENGER: "messenger";
};
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationName: string;
    timezone?: string;
}
export interface LoginDto {
    email: string;
    password: string;
}
export interface AuthResponse {
    accessToken: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
    };
    organization: {
        id: string;
        name: string;
        slug: string;
    };
}
export interface WhatsAppConnectDto {
    code: string;
}
export interface SendMessageDto {
    conversationId: string;
    type: 'text' | 'template' | 'image' | 'document';
    content: {
        text?: string;
        templateName?: string;
        templateLanguage?: string;
        templateComponents?: Record<string, unknown>[];
        mediaUrl?: string;
        caption?: string;
    };
}
export interface MetaWebhookPayload {
    object: string;
    entry: MetaWebhookEntry[];
}
export interface MetaWebhookEntry {
    id: string;
    changes: MetaWebhookChange[];
}
export interface MetaWebhookChange {
    value: {
        messaging_product: string;
        metadata: {
            display_phone_number: string;
            phone_number_id: string;
        };
        contacts?: MetaWebhookContact[];
        messages?: MetaWebhookMessage[];
        statuses?: MetaWebhookStatus[];
    };
    field: string;
}
export interface MetaWebhookContact {
    profile: {
        name: string;
    };
    wa_id: string;
}
export interface MetaWebhookMessage {
    from: string;
    id: string;
    timestamp: string;
    type: string;
    text?: {
        body: string;
    };
    image?: {
        id: string;
        mime_type: string;
        sha256: string;
        caption?: string;
    };
    document?: {
        id: string;
        mime_type: string;
        sha256: string;
        filename: string;
        caption?: string;
    };
    video?: {
        id: string;
        mime_type: string;
        sha256: string;
        caption?: string;
    };
    audio?: {
        id: string;
        mime_type: string;
        sha256: string;
    };
    sticker?: {
        id: string;
        mime_type: string;
        sha256: string;
    };
    location?: {
        latitude: number;
        longitude: number;
        name?: string;
        address?: string;
    };
    contacts?: Record<string, unknown>[];
    interactive?: Record<string, unknown>;
    reaction?: {
        message_id: string;
        emoji: string;
    };
}
export interface MetaWebhookStatus {
    id: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: string;
    recipient_id: string;
    errors?: {
        code: number;
        title: string;
        message: string;
    }[];
}
export interface CreateContactDto {
    waId: string;
    name?: string;
    email?: string;
    optedIn?: boolean;
    optedInSource?: string;
}
export interface UpdateContactDto {
    name?: string;
    email?: string;
    optedIn?: boolean;
    optedInSource?: string;
}
export interface CreateTemplateDto {
    name: string;
    category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
    language: string;
    components: TemplateComponent[];
}
export interface TemplateComponent {
    type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
    format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    text?: string;
    example?: {
        header_text?: string[];
        body_text?: string[][];
    };
    buttons?: TemplateButton[];
}
export interface TemplateButton {
    type: 'URL' | 'PHONE_NUMBER' | 'QUICK_REPLY';
    text: string;
    url?: string;
    phone_number?: string;
}
export interface CreateBroadcastDto {
    name: string;
    templateId: string;
    audienceFilter?: AudienceFilter;
    scheduledAt?: string;
}
export interface AudienceFilter {
    tags?: {
        include?: string[];
        exclude?: string[];
    };
    customFields?: {
        fieldId: string;
        operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains';
        value: string;
    }[];
    optedInOnly?: boolean;
}
export interface CreateWorkflowDto {
    name: string;
    description?: string;
    triggerType: string;
    triggerConfig: Record<string, unknown>;
    steps: WorkflowStep[];
}
export interface WorkflowStep {
    id: string;
    type: 'condition' | 'action';
    action: string;
    config: Record<string, unknown>;
}
export interface CreateDealDto {
    stageId: string;
    contactId: string;
    conversationId?: string;
    title: string;
    value?: number;
    currency?: string;
}
export interface MoveDealDto {
    stageId: string;
}
export interface AnalyticsOverview {
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    sentChange: number;
    deliveredRate: number;
    readRate: number;
    failedRate: number;
}
export interface DailyAnalytics {
    date: string;
    sent: number;
    delivered: number;
    read: number;
    failed: number;
}
export interface AgentPerformance {
    agentId: string;
    agentName: string;
    avatarUrl: string | null;
    conversationsHandled: number;
    avgResponseTimeMs: number;
    resolutionRate: number;
}
export declare function isWithin24HourWindow(lastCustomerMessageAt: Date | null): boolean;
export declare function slugify(text: string): string;
export declare function generateApiKeyPrefix(key: string): string;
