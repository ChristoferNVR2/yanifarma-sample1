import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { salesService } from '@/api/services';
import { Card, Button, Input, Select, Spinner } from '@/components/common';

const saleEditSchema = z.object({
	tipo_comprobante: z.string().min(1, 'Tipo de comprobante es requerido'),
	nro_comprobante: z.string().min(1, 'Número de comprobante es requerido'),
});

type SaleEditForm = z.infer<typeof saleEditSchema>;

const SaleEdit = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [formData, setFormData] = useState<SaleEditForm>({
		tipo_comprobante: '',
		nro_comprobante: '',
	});
	const [errors, setErrors] = useState<Partial<Record<keyof SaleEditForm, string>>>({});

	// Load sale data
	useEffect(() => {
		const fetchSale = async () => {
			if (!id) return;

			try {
				setLoading(true);
				const response = await salesService.getById(Number(id));
				// Note: Backend needs to return comprobante info
				// For now, using placeholder values
				setFormData({
					tipo_comprobante: 'Boleta',
					nro_comprobante: '',
				});
			} catch (error) {
				toast.error('Error al cargar venta');
				navigate('/sales');
			} finally {
				setLoading(false);
			}
		};

		void fetchSale();
	}, [id, navigate]);

	// Handle form change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (errors[name as keyof SaleEditForm]) {
			setErrors(prev => ({ ...prev, [name]: undefined }));
		}
	};

	// Handle submit
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			// Validate
			saleEditSchema.parse(formData);
			setErrors({});

			setSubmitting(true);

			await salesService.update(Number(id), formData);

			toast.success('Venta actualizada exitosamente');
			navigate(`/sales/${id}`);
		} catch (error) {
			if (error instanceof z.ZodError) {
				const fieldErrors: Partial<Record<keyof SaleEditForm, string>> = {};
				error.errors.forEach(err => {
					if (err.path[0]) {
						fieldErrors[err.path[0] as keyof SaleEditForm] = err.message;
					}
				});
				setErrors(fieldErrors);
			} else {
				toast.error('Error al actualizar venta');
				console.error('Error updating sale:', error);
			}
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Spinner size="lg" />
			</div>
		);
	}

	return (
		<div>
			{/* Header */}
			<div className="mb-6">
				<button
					onClick={() => navigate(`/sales/${id}`)}
					className="flex items-center text-primary-600 hover:text-primary-800 mb-4"
				>
					<ArrowLeft size={20} className="mr-2" />
					Volver a Detalles
				</button>

				<h1 className="text-3xl font-bold text-gray-800">Editar Venta #{id}</h1>
				<p className="text-gray-600 mt-1">Actualizar información del comprobante</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Form */}
				<div className="lg:col-span-2">
					<Card>
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Warning */}
							<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
								<AlertTriangle className="text-yellow-600 mt-0.5" size={20} />
								<div>
									<p className="font-medium text-yellow-900 mb-1">
										Edición Limitada
									</p>
									<p className="text-sm text-yellow-800">
										Solo se puede editar la información del comprobante. Los
										productos vendidos y el monto total no pueden modificarse una vez
										registrada la venta.
									</p>
								</div>
							</div>

							{/* Tipo de Comprobante */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Tipo de Comprobante <span className="text-red-500">*</span>
								</label>
								<Select
									name="tipo_comprobante"
									value={formData.tipo_comprobante}
									onChange={handleChange}
									error={errors.tipo_comprobante}
								>
									<option value="">Seleccionar...</option>
									<option value="Boleta">Boleta</option>
									<option value="Factura">Factura</option>
								</Select>
								{errors.tipo_comprobante && (
									<p className="mt-1 text-sm text-red-600">
										{errors.tipo_comprobante}
									</p>
								)}
							</div>

							{/* Número de Comprobante */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Número de Comprobante <span className="text-red-500">*</span>
								</label>
								<Input
									type="text"
									name="nro_comprobante"
									value={formData.nro_comprobante}
									onChange={handleChange}
									placeholder="Ej: B001-001234"
									error={errors.nro_comprobante}
								/>
								{errors.nro_comprobante && (
									<p className="mt-1 text-sm text-red-600">{errors.nro_comprobante}</p>
								)}
							</div>

							{/* Actions */}
							<div className="flex gap-4">
								<Button
									type="submit"
									variant="primary"
									disabled={submitting}
									className="flex items-center gap-2"
								>
									<Save size={18} />
									{submitting ? 'Guardando...' : 'Guardar Cambios'}
								</Button>
								<Button
									type="button"
									variant="secondary"
									onClick={() => navigate(`/sales/${id}`)}
									disabled={submitting}
								>
									Cancelar
								</Button>
							</div>
						</form>
					</Card>
				</div>

				{/* Help Sidebar */}
				<div>
					<Card title="Información">
						<div className="space-y-4 text-sm">
							<div>
								<p className="font-medium text-gray-800 mb-1">¿Qué puedes editar?</p>
								<ul className="text-gray-600 space-y-1">
									<li>• Tipo de comprobante</li>
									<li>• Número de comprobante</li>
								</ul>
							</div>

							<div className="border-t border-gray-200 pt-4">
								<p className="font-medium text-gray-800 mb-1">¿Qué NO puedes editar?</p>
								<ul className="text-gray-600 space-y-1">
									<li>• Cliente</li>
									<li>• Productos vendidos</li>
									<li>• Cantidades</li>
									<li>• Precios</li>
									<li>• Monto total</li>
									<li>• Fecha y hora</li>
								</ul>
							</div>

							<div className="border-t border-gray-200 pt-4">
								<p className="text-gray-600">
									<strong>Nota:</strong> Si necesitas modificar los productos o montos,
									deberás eliminar esta venta y crear una nueva.
								</p>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default SaleEdit;
