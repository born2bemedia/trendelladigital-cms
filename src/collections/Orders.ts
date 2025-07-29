import type { CollectionConfig } from 'payload'

import sgMail from '@sendgrid/mail'
import { paymentReceivedBody } from '@/features/request-form-body'

sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '')

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      label: 'Order Number',
      required: true,
      unique: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Ordered Items',
      fields: [
        {
          name: 'product_name',
          type: 'text',
          label: 'Product Name',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'total',
      type: 'number',
      label: 'Total Amount',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'paymentMethod',
      type: 'text',
      label: 'Payment method',
      required: false,
    },
    {
      name: 'orderNotes',
      type: 'text',
      label: 'Order Notes',
      required: false,
    },
    {
      name: 'billingAddress',
      type: 'group',
      fields: [
        { name: 'firstName', type: 'text', required: false },
        { name: 'lastName', type: 'text', required: false },
        { name: 'email', type: 'email', required: false },
        { name: 'phone', type: 'text', required: false },
        { name: 'street', type: 'text', required: false },
        { name: 'addressLine2', type: 'text', required: false },
        { name: 'city', type: 'text', required: false },
        { name: 'country', type: 'text', required: false },
        { name: 'zip', type: 'text', required: false },
      ],
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'documents',
      type: 'upload',
      relationTo: 'media',
      label: 'Documents',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'invoice',
      type: 'upload',
      relationTo: 'media',
      label: 'Invoice',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        console.log('Incoming data:', data)
      },
    ],
    afterChange: [
      async ({ doc, previousDoc }) => {
        const statusChanged = doc.status !== previousDoc?.status
        const isCompleted = doc.status === 'completed'

        if (statusChanged && isCompleted && doc.billingAddress?.email) {
          try {
            await sgMail.send({
              to: doc.billingAddress.email,
              from: process.env.FROM_EMAIL || 'noreply@trendelladigital.com',
              subject: 'Payment Received — Let’s Begin Your Strategy',
              html: paymentReceivedBody({
                username: doc.billingAddress.firstName,
                orderNumber: doc.orderNumber,
              }),
            })
          } catch (err) {
            console.error('Failed to send email:', err)
          }
        }
      },
    ],
  },
}

export default Orders
