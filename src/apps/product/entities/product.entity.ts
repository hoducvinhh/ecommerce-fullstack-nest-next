import { Category } from "src/apps/category/entities/category.entity";
import { BaseUuidEntity } from "src/config/database/base-uuid.entity";
import { decimalColumn, decimalColumnTransformer, nullableDecimalColumn } from "src/shared/utils/decimal-column.transformer";
import { Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

@Entity()
@Index('idx_product_featured', ['isFeatured'], {
    where: '"is_featured" = true AND "is_active" = true AND "delete_at" IS NULL',
})
export class Product extends BaseUuidEntity {

    @Index()
    @Column({ type: 'uuid' })
    categoryId: string;


    @Column({ type: 'varchar', length: 255 })
    name: string;


    @Column({ type: 'text', nullable: true })
    shortDescription: string | null;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;


    @Column(decimalColumn)
    price: number;

    @Column(nullableDecimalColumn)
    compareAtPrice: number | null;

    @Column({ default: 0 })
    stockQuantity: number;

    @Column({ unique: true })
    sku: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: true })
    isFeatured: boolean;

    @Column({ default: true })
    hasVariants: boolean;

    @Column({ default: 0 })
    viewCount: number;

    @Column({
        type: 'decimal',
        precision: 3,
        scale: 2,
        default: 0,
        transformer: decimalColumnTransformer,
    })
    ratingAverage: number;


    @Column({ default: 0 })
    reviewCount: number;

    @Column(nullableDecimalColumn)
    weight: number | null;

    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deleteAt: Date | null;

    //relations
    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;
}
