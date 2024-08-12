// src/models/Member.ts

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { Organization, OrganizationInterface } from "./Organization";
import { v4 as uuidv4 } from "uuid";

export interface MemberInterface {
  lastName?: string;
  firstName?: string;
  email: string;
  organizationId: string;
  stytchMemberId?: string;
  organization?: OrganizationInterface;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

@Table({
  tableName: "members",
  timestamps: true,
  paranoid: true,
})
export class Member extends Model<MemberInterface> {
  @PrimaryKey
  @Default(uuidv4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  organizationId!: string;

  @BelongsTo(() => Organization)
  organization!: Organization;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  stytchMemberId!: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updatedAt!: Date;
}
