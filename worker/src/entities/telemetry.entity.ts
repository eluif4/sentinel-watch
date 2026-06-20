import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('telemetry')
export class TelemetryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: string;

    @Column({
        type: 'enum',
        enum: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    })
    method: string;

    @Column()
    statusCode: number;

    @Column()
    responseTimeMs: number;

    @Column({ default: false })
    @Index()
    isAlert: boolean;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    createdAt: Date;
}
