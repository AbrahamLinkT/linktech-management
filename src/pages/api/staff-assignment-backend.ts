import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;
  const action = query.action as string;
  const email = query.email as string;
  const projectId = query.projectId as string;

  try {
    // Validar que MONGODB_URI está configurado
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI no está configurado');
      return res.status(500).json({
        error: 'Database connection not configured',
        message: 'MONGODB_URI environment variable is missing'
      });
    }

    const db = await connectDB();
    const collection = db.collection('staffassignmentrequests');

    switch (method) {
      case 'GET':
        if (action === 'pending' && email) {
          // GET /api/staff-assignment-backend?action=pending&email=...
          const requests = await collection
            .find({
              department_head_email: email.toLowerCase(),
              status: 'pending'
            })
            .sort({ created_at: -1 })
            .toArray();

          return res.status(200).json({
            success: true,
            requests: requests
          });
        }

        if (action === 'project' && projectId) {
          // GET /api/staff-assignment-backend?action=project&projectId=...
          const requests = await collection
            .find({ project_id: projectId })
            .sort({ created_at: -1 })
            .toArray();

          return res.status(200).json({
            success: true,
            requests: requests
          });
        }

        return res.status(400).json({ error: 'Invalid query parameters' });

      case 'POST':
        if (action === 'create') {
          // POST /api/staff-assignment-backend?action=create
          const {
            project_id,
            project_name,
            worker_id,
            worker_name,
            department_head_email,
          } = req.body;

          if (!project_id || !worker_id || !department_head_email) {
            return res.status(400).json({
              error: 'Missing required fields'
            });
          }

          const newRequest = {
            ...req.body,
            status: 'pending',
            created_at: new Date(),
            updated_at: new Date()
          };

          const result = await collection.insertOne(newRequest);

          return res.status(201).json({
            success: true,
            data: { _id: result.insertedId, ...newRequest }
          });
        }

        return res.status(400).json({ error: 'Invalid action' });

      case 'PUT':
        if (action === 'approve') {
          // PUT /api/staff-assignment-backend?action=approve&id=...
          const { id } = query;
          const { approved_by } = req.body;

          if (!id) {
            return res.status(400).json({ error: 'Request ID is required' });
          }

          const { ObjectId } = require('mongodb');
          const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(id as string) },
            {
              $set: {
                status: 'approved',
                approved_by,
                approved_at: new Date(),
                updated_at: new Date()
              }
            },
            { returnDocument: 'after' }
          );

          if (!result || !result.value) {
            return res.status(404).json({ error: 'Request not found' });
          }

          return res.status(200).json({
            success: true,
            data: result.value
          });
        }

        if (action === 'reject') {
          // PUT /api/staff-assignment-backend?action=reject&id=...
          const { id } = query;
          const { approved_by, reason } = req.body;

          if (!id) {
            return res.status(400).json({ error: 'Request ID is required' });
          }

          const { ObjectId } = require('mongodb');
          const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(id as string) },
            {
              $set: {
                status: 'rejected',
                approved_by,
                rejection_reason: reason,
                rejected_at: new Date(),
                updated_at: new Date()
              }
            },
            { returnDocument: 'after' }
          );

          if (!result || !result.value) {
            return res.status(404).json({ error: 'Request not found' });
          }

          return res.status(200).json({
            success: true,
            data: result.value
          });
        }

        return res.status(400).json({ error: 'Invalid action' });

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('❌ API Error en /api/staff-assignment-backend:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Unknown error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
