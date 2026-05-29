import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('tests')
export class Test {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  testName!: string;

  @Column()
  testNumber!: number;

  @Column({ type: 'date' })
  testDate!: Date;

  // Türkçe
  @Column({ default: 0 })
  turkceCorrect!: number;

  @Column({ default: 0 })
  turkceWrong!: number;

  @Column({ default: 0 })
  turkceEmpty!: number;

  @Column({ type: 'float', default: 0 })
  turkceNet!: number;

  // Matematik
  @Column({ default: 0 })
  matematikCorrect!: number;

  @Column({ default: 0 })
  matematikWrong!: number;

  @Column({ default: 0 })
  matematikEmpty!: number;

  @Column({ type: 'float', default: 0 })
  matematikNet!: number;

  // Hayat Bilgisi
  @Column({ default: 0 })
  hayatBilgisiCorrect!: number;

  @Column({ default: 0 })
  hayatBilgisiWrong!: number;

  @Column({ default: 0 })
  hayatBilgisiEmpty!: number;

  @Column({ type: 'float', default: 0 })
  hayatBilgisiNet!: number;

  // İngilizce
  @Column({ default: 0 })
  ingilizceCorrect!: number;

  @Column({ default: 0 })
  ingilizceWrong!: number;

  @Column({ default: 0 })
  ingilizceEmpty!: number;

  @Column({ type: 'float', default: 0 })
  ingilizceNet!: number;

  // Toplam
  @Column({ type: 'float', default: 0 })
  totalNet!: number;

  @Column({ type: 'float', default: 0 })
  successPercentage!: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Calculate net scores
  calculateNets(): void {
    this.turkceNet = this.turkceCorrect - (this.turkceWrong / 4);
    this.matematikNet = this.matematikCorrect - (this.matematikWrong / 4);
    this.hayatBilgisiNet = this.hayatBilgisiCorrect - (this.hayatBilgisiWrong / 4);
    this.ingilizceNet = this.ingilizceCorrect - (this.ingilizceWrong / 4);
    
    this.totalNet = this.turkceNet + this.matematikNet + this.hayatBilgisiNet + this.ingilizceNet;
    
    const totalCorrect = this.turkceCorrect + this.matematikCorrect + this.hayatBilgisiCorrect + this.ingilizceCorrect;
    const totalWrong = this.turkceWrong + this.matematikWrong + this.hayatBilgisiWrong + this.ingilizceWrong;
    const totalEmpty = this.turkceEmpty + this.matematikEmpty + this.hayatBilgisiEmpty + this.ingilizceEmpty;
    const totalQuestions = totalCorrect + totalWrong + totalEmpty;
    
    this.successPercentage = totalQuestions > 0 
      ? Math.round((totalCorrect / totalQuestions) * 100) 
      : 0;
  }
}
