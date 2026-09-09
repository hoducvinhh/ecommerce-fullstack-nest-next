import { User } from "src/apps/user/entities/user.entity";
import { BaseUuidEntity } from "src/config/database/base-uuid.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";


@Entity()
export class Account extends BaseUuidEntity {

    @Column({ type: 'uuid' })
    userId: string;


    @Column({ type: 'text' })
    accountId: string;

    @Column({ type: 'text' })
    providerId: string

    //relations
    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'user_id' })
    user: User;
}