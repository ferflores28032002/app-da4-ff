import slugify from "slugify";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('varchar', { unique: true })
    name: string

    @Column('varchar')
    description: string

    @Column({ type: 'integer', default: 0 })
    stock: number;

    @Column('float', { default: 0 })
    price: number;

    @Column('varchar', { nullable: true })
    slug: string

    @Column('boolean', {
        default: true
    })
    isActive: boolean

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updateAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt?: Date;

    @BeforeInsert()
    createSlug() {
        if (!this.slug) {
            this.slug = slugify(this.normalize(this.name), { lower: true, replacement: '_', remove: /[*+~.()'"!:@]/g });
        } else {
            this.slug = slugify(this.normalize(this.slug), { lower: true, replacement: '_', remove: /[*+~.()'"!:@]/g });
        }
    }

    @BeforeUpdate()
    updateSlug() {
        if (!this.slug) {
            this.slug = slugify(this.normalize(this.name), { lower: true, replacement: '_', remove: /[*+~.()'"!:@]/g });
        } else {
            this.slug = slugify(this.normalize(this.slug), { lower: true, replacement: '_', remove: /[*+~.()'"!:@]/g });
        }
    }

    private normalize(text: string): string {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/'/g, "");
    }

    // Validación adicional para evitar cadenas que contengan solo espacios en blanco
    @BeforeInsert()
    @BeforeUpdate()
    trimStrings() {
        this.name = this.name.trim();
        this.description = this.description.trim();
        if (this.slug) {
            this.slug = this.slug.trim();
        }
    }

    @BeforeUpdate()
    updateDeleteAt() {
        if (this.isActive === false && !this.deleteAt) {
            this.deleteAt = new Date();
        }
    }
}
