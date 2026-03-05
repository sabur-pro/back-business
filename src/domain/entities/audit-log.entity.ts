export enum AuditAction {
    PRODUCT_CREATED = 'PRODUCT_CREATED',
    PRODUCT_BATCH_CREATED = 'PRODUCT_BATCH_CREATED',
    PRODUCT_UPDATED = 'PRODUCT_UPDATED',
    PRODUCT_DELETED = 'PRODUCT_DELETED',
    PRODUCT_RESTORED = 'PRODUCT_RESTORED',
    SHIPMENT_CREATED = 'SHIPMENT_CREATED',
    SHIPMENT_ACCEPTED = 'SHIPMENT_ACCEPTED',
    SHIPMENT_CANCELLED = 'SHIPMENT_CANCELLED',
}

export class AuditLogEntity {
    constructor(
        public readonly id: string,
        public readonly action: AuditAction,
        public readonly entityType: string,
        public readonly entityId: string,
        public readonly userId: string,
        public readonly accountId: string,
        public readonly oldData: any | null,
        public readonly newData: any | null,
        public readonly metadata: any | null,
        public readonly createdAt: Date,
        public readonly userName?: string,
    ) { }

    static create(props: {
        id: string;
        action: AuditAction;
        entityType: string;
        entityId: string;
        userId: string;
        accountId: string;
        oldData?: any | null;
        newData?: any | null;
        metadata?: any | null;
        createdAt?: Date;
        userName?: string;
    }): AuditLogEntity {
        return new AuditLogEntity(
            props.id,
            props.action,
            props.entityType,
            props.entityId,
            props.userId,
            props.accountId,
            props.oldData ?? null,
            props.newData ?? null,
            props.metadata ?? null,
            props.createdAt ?? new Date(),
            props.userName,
        );
    }
}
