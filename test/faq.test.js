import { expect } from 'chai';
import request from 'supertest';
import { app } from '../src/app.js';
import { FAQ } from '../src/models/faqModel.js';

describe('FAQ API Tests', () => {
  before(async () => {
    // Clear test data
    await FAQ.deleteMany({});
  });

  it('should create a new FAQ', async () => {
    const res = await request(app)
      .post('/api/faqs')
      .send({
        question: 'What is Node.js?',
        answer: 'JavaScript runtime environment'
      });
    
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('_id');
  });

  it('should get FAQs in Hindi', async () => {
    const res = await request(app)
      .get('/api/faqs')
      .query({ lang: 'hi' });
    
    expect(res.status).to.equal(200);
    expect(res.body[0].question).to.include('नोड');
  });
});