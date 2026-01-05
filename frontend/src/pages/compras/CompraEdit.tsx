import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { comprasService } from '@/api/services';
import { Card, Button, Input, Select, Spinner } from '@/components/common';

const compraEditSchema = z.object({
	estado: z.string().min(1, 'Estado es requerido'),
	fecha_pago: z.string().optional(),
});

type CompraEditForm = z.infer<typeof compraEditSchema>;

const CompraEdit = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [formData, setFormData] = useState<CompraEditForm>({
		estado: '',
		fecha_pago: '',
	});
	const [errors, setErrors] = useState<Partial<Record<keyof CompraEditForm, string>>>({});

	// Load compra data
	useEffect(() => {
		const fetchCompra = async () => {
			if (!id) return;

			try {
				setLoading(true);
				const response = await comprasService.getById(Number(id));
				setFormData({
					estado: response.data.estado,
					fecha_pago: response.data.fecha_pago || '',
				});
			} catch (error) {
				toast.error('Error al cargar compra');
				navigate('/compras');
			} finally {
				setLoading(false);
			}
		};

		void fetchCompra();
	}, [id, navigate]);

	// Handle form change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		// Clear error for this field
		if (errors[name as keyof CompraEditForm]) {
			setErrors(prev => ({ ...prev, [name]: undefined }));
		}
	};

	// Handle submit
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			// Validate
			compraEditSchema.parse(formData);
			setErrors({});

			setSubmitting(true);

			// Prepare data
			const updateData: any = {
				estado: formData.estado,
			};

			// Only include fecha_pago if estado is "Pagado" and date is provided
			if (formData.estado.toLowerCase() === 'pagado' && formData.fecha_pago) {
				updateData.fecha_pago = formData.fecha_pago;
			}

			await comprasService.update(Number(id), updateData);

			toast.success('Compra actualizada exitosamente');
			navigate(`/compras/${id}`);
		} catch (error) {
			if (error instanceof z.ZodError) {
				const fieldErrors: Partial<Record<keyof CompraEditForm, string>> = {};
				error.errors.forEach(err => {
					if (err.path[0]) {
						fieldErrors[err.path[0] as keyof CompraEditForm] = err.message;
					}
				});
				setErrors(fieldErrors);
			} else {
				toast.error('Error al actualizar compra');
				console.error('Error updating compra:', error);
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
					onClick={() => navigate(`/compras/${id}`)}
					className="flex items-center text-primary-600 hover:text-primary-800 mb-4"
				>
					<ArrowLeft size={20} className="mr-2" />
					Volver a Detalles
				</button>

				<h1 className="text-3xl font-bold text-gray-800">Editar Compra #{id}</h1>
				<p className="text-gray-600 mt-1">Actualizar estado y fecha de pago</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Form */}
				<div className="lg:col-span-2">
					<Card>
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Estado */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Estado <span className="text-red-500">*</span>
								</label>
								<Select
									name="estado"
									value={formData.estado}
									onChange={handleChange}
									error={errors.estado}
								>
									<option value="">Seleccionar estado...</option>
									<option value="Pendiente">Pendiente</option>
									<option value="Pagado">Pagado</option>
									<option value="Cancelado">Cancelado</option>
								</Select>
								{errors.estado && (
									<p className="mt-1 text-sm text-red-600">{errors.estado}</p>
								)}
							</div>

							{/* Fecha Pago - Only show if Pagado */}
							{formData.estado.toLowerCase() === 'pagado' && (
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Fecha de Pago
									</label>
									<Input
										type="date"
										name="fecha_pago"
										value={formData.fecha_pago}
										onChange={handleChange}
										error={errors.fecha_pago}
									/>
									{errors.fecha_pago && (
										<p className="mt-1 text-sm text-red-600">{errors.fecha_pago}</p>
									)}
								</div>
							)}

							{/* Info Box */}
							<div
								className={`p-4 rounded-lg border ${
									formData.estado.toLowerCase() === 'pagado'
										? 'bg-green-50 border-green-200'
										: formData.estado.toLowerCase() === 'pendiente'
											? 'bg-yellow-50 border-yellow-200'
											: 'bg-red-50 border-red-200'
								}`}
							>
								<p className="text-sm font-medium text-gray-800 mb-2">
									Estado: {formData.estado || 'No seleccionado'}
								</p>
								<p className="text-sm text-gray-600">
									{formData.estado.toLowerCase() === 'pagado' &&
										'Marca la compra como pagada y registra la fecha de pago.'}
									{formData.estado.toLowerCase() === 'pendiente' &&
										'La compra está pendiente de pago.'}
									{formData.estado.toLowerCase() === 'cancelado' &&
										'Esta compra será cancelada.'}
								</p>
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
									onClick={() => navigate(`/compras/${id}`)}
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
					<Card title="Ayuda">
						<div className="space-y-4 text-sm">
							<div>
								<p className="font-medium text-gray-800 mb-1">🟡 Pendiente</p>
								<p className="text-gray-600">La compra está registrada pero no pagada.</p>
							</div>
							<div>
								<p className="font-medium text-gray-800 mb-1">🟢 Pagado</p>
								<p className="text-gray-600">
									La compra ha sido pagada. Registra la fecha de pago.
								</p>
							</div>
							<div>
								<p className="font-medium text-gray-800 mb-1">🔴 Cancelado</p>
								<p className="text-gray-600">La compra fue cancelada y no se procesará.</p>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default CompraEdit;
