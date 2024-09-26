const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors({}));

// Create (створення нової мережі)
app.post('/networks', async (req, res) => {
	const { number, name, calling, description, particularity, frequency, x, y } =
		req.body;
	try {
		const newNetwork = await prisma.network.create({
			data: {
				number,
				name,
				calling,
				description,
				particularity,
				frequency,
				x,
				y,
			},
		});
		res.json(newNetwork);
	} catch (error) {
		res.status(500).json({ error: 'Помилка при створенні мережі' });
	}
});

// Read (отримання всіх мереж)
app.get('/networks', async (req, res) => {
	try {
		const networks = await prisma.network.findMany();
		res.json(networks);
	} catch (error) {
		res.status(500).json({ error: 'Помилка при отриманні мереж' });
	}
});

// Read (отримання конкретної мережі за id)
app.get('/networks/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const network = await prisma.network.findUnique({
			where: { id: parseInt(id) },
		});
		if (network) {
			res.json(network);
		} else {
			res.status(404).json({ error: 'Мережу не знайдено' });
		}
	} catch (error) {
		res.status(500).json({ error: 'Помилка при отриманні мережі' });
	}
});

// Update (оновлення даних мережі)
app.put('/networks/:id', async (req, res) => {
	const { id } = req.params;
	const { number, name, calling, description, particularity, frequency, x, y } =
		req.body;
	try {
		const updatedNetwork = await prisma.network.update({
			where: { id: parseInt(id) },
			data: {
				number,
				name,
				calling,
				description,
				particularity,
				frequency,
				x,
				y,
			},
		});
		res.json(updatedNetwork);
	} catch (error) {
		res.status(500).json({ error: 'Помилка при оновленні мережі' });
	}
});

// Delete (видалення мережі)
app.delete('/networks/:id', async (req, res) => {
	const { id } = req.params;
	try {
		await prisma.network.delete({
			where: { id: parseInt(id) },
		});
		res.json({ message: 'Мережу видалено' });
	} catch (error) {
		res.status(500).json({ error: 'Помилка при видаленні мережі' });
	}
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Сервер запущено на порту ${PORT}`);
});
