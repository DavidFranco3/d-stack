import { Resource } from '../models/Resource.js';

export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json({ ok: true, data: resources });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

export const createResource = async (req, res) => {
  try {
    const { name, category, price, currency } = req.body;
    const count = await Resource.countDocuments();
    const code = `REC-00${count + 1}`;
    const resource = await Resource.create({
      code,
      name,
      category,
      price: Number(price) || 0,
      currency: currency || 'USD',
      status: 1,
    });
    res.status(201).json({ ok: true, data: resource });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, currency } = req.body;
    const resource = await Resource.findByIdAndUpdate(
      id,
      { name, category, price: Number(price) || 0, currency },
      { new: true }
    );
    res.json({ ok: true, data: resource });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

export const softDeleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByIdAndUpdate(id, { status: 0 }, { new: true });
    res.json({ ok: true, data: resource });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

export const restoreResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByIdAndUpdate(id, { status: 1 }, { new: true });
    res.json({ ok: true, data: resource });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};
