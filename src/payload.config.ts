import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import nodemailerSendgrid from 'nodemailer-sendgrid'
import { deeplTranslatorPlugin } from './deepl-translator'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Groups } from './collections/Groups'
import { Packages } from './collections/Packages'
import Orders from './collections/Orders'
import { Policies } from './collections/Policies'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { Posts } from './collections/Posts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Products, Groups, Packages, Orders, Policies, Posts],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  localization: {
    locales: ['en', 'it', 'de', 'ro'],
    defaultLocale: 'en',
  },
  plugins: [
    payloadCloudPlugin(),
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || '',
        endpoint: process.env.S3_ENDPOINT || '',
      },
    }),
    deeplTranslatorPlugin({
      enabled: true,
      fallbackLocales: ['de', 'it', 'ro'],
      collections: {
        policies: { fields: ['title', 'content'] },
        posts: { fields: ['title', 'content'] },
        groups: { fields: ['name'] },
        products: { fields: ['name'] },
        packages: { fields: ['name', 'description'] },
      },
    }),
  ],
  email: nodemailerAdapter({
    defaultFromName: 'Trendella',
    defaultFromAddress: 'noreply@trendelladigital.com',
    transportOptions: nodemailerSendgrid({
      apiKey: process.env.SENDGRID_API_KEY ?? '',
    }),
  }),
})
