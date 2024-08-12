// src/models/Tenant.ts

import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { Member } from "./Member";
import { v4 as uuidv4 } from "uuid";

export interface OrganizationInterface {
  id?: string;
  connectionId?: string;
  stytchOrganizationId?: string;
  idpSignOnUrl?: string;
  idpIssuerUrl?: string;
  stytchAudienceUrl?: string;
  stytchAcsUrl?: string;
  metaDataUrl?: string;
  domain: string;
  companyName: string;
  samlConfigured?: boolean;
  members?: Member[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

@Table({
  tableName: "organizations",
  timestamps: true,
  paranoid: true,
})
export class Organization extends Model<OrganizationInterface> {
  @PrimaryKey
  @Default(uuidv4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  metaDataUrl?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  connectionId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  stytchOrganizationId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  idpSignOnUrl?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  samlConfigured?: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  idpIssuerUrl?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  stytchAudienceUrl?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  stytchAcsUrl?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  domain!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  companyName!: string;

  @HasMany(() => Member)
  members!: Member[];

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
