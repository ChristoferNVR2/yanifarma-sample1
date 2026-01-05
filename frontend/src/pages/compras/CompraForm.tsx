import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { comprasService } from '@/api/services';
import { Card, Button, Input, Select } from '@/components/common';

const compraFormSchema = z.object({
	id_pedido: z.number().min(1, 'Pedido es requerido'),
	fecha_recepcion: z.string().min(1, 'Fecha de recepción es requerida'),
	nro_guia: z.string().optional(),
	tipo_comprobante: z.string().optional(),
	nro_comprobante: z.string().optional(),
	monto_total: z.number().min(0.01, 'Monto debe ser mayor a 0'),
	estado: z.string().min(1, 'Estado es requerido'),
	fecha_pago: z.string().optional(),
});

type CompraFormData = z.infer<typeof compraFormSchema>;

const CompraForm = () => {
	const navigate = useNavigate();
	const [submitting, setSubmitting] = useState(false);
	const [formData, setFormData] = useState<Partial<CompraFormData>>({
		fecha_recepcion: new Date().toISOString().split('T')[0],
		estado: 'Pendiente',
		tipo_comprobante: 'Factura',
	});
	const [errors, setErrors] = useState<Partial<Record<keyof CompraFormData, string>>>({});

	// Handle form change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'number' ? parseFloat(value) || 0 : value,
		}));
		// Clear error
		if (errors[name as keyof CompraFormData]) {
			setErrors(prev => ({ ...prev, [name]: undefined }));
		}
	};

	// Handle submit
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			// Validate
			const validatedData = compraFormSchema.parse(formData);
			setErrors({});

			setSubmitting(true);

			const response = await comprasService.create(validatedData);

			toast.success('Compra creada exitosamente');
			navigate(`/compras/${response.data.id_compra}`);
		} catch (error) {
			if (error instanceof z.ZodError) {
				const fieldErrors: Partial<Record<keyof CompraFormData, string>> = {};
				error.errors.forEach(err => {
					if (err.path[0]) {
						fieldErrors[err.path[0] as keyof CompraFormData] = err.message;
					}
				});
				setErrors(fieldErrors);
			} else {
				toast.error('Error al crear compra');
				console.error('Error creating compra:', error);
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div>
			{/* Header */}
			<div className="mb-6">
				<button
					onClick={() => navigate('/compras')}
					className="flex items-center text-primary-600 hover:text-primary-800 mb-4"
				>
					<ArrowLeft size={20} className="mr-2" />
					Volver a Compras
				</button>

				<h1 className="text-3xl font-bold text-gray-800">Nueva Compra</h1>
				<p className="text-gray-600 mt-1">Registrar recepción de mercadería</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Form */}
				<div className="lg:col-span-2">
					<Card>
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Pedido */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Número de Pedido <span className="text-red-500">*</span>
								</label>
								<Input
									type="number"
									name="id_pedido"
									value={formData.id_pedido || ''}
									onChange={handleChange}
									placeholder="Ej: 6001"
									error={errors.id_pedido}
								/>
								{errors.id_pedido && (
									<p className="mt-1 text-sm text-red-600">{errors.id_pedido}</p>
								)}
								<p className="mt-1 text-sm text-gray-500">
									ID del pedido del cual se recibe la mercadería
								</p>
							</div>

							{/* Fecha Recepción */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Fecha de Recepción <span className="text-red-500">*</span>
								</label>
								<Input
									type="date"
									name="fecha_recepcion"
									value={formData.fecha_recepcion || ''}
									onChange={handleChange}
									error={errors.fecha_recepcion}
								/>
								{errors.fecha_recepcion && (
									<p className="mt-1 text-sm text-red-600">{errors.fecha_recepcion}</p>
								)}
							</div>

							{/* Número de Guía */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Número de Guía
								</label>
								<Input
									type="text"
									name="nro_guia"
									value={formData.nro_guia || ''}
									onChange={handleChange}
									placeholder="Ej: G000452"
									error={errors.nro_guia}
								/>
							</div>

							{/* Comprobante */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Tipo de Comprobante
									</label>
									<Select
										name="tipo_comprobante"
										value={formData.tipo_comprobante || ''}
										onChange={handleChange}
									>
										<option value="">Seleccionar...</option>
										<option value="Factura">Factura</option>
										<option value="Boleta">Boleta</option>
									</Select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Número de Comprobante
									</label>
									<Input
										type="text"
										name="nro_comprobante"
										value={formData.nro_comprobante || ''}
										onChange={handleChange}
										placeholder="Ej: F001-002356"
										error={errors.nro_comprobante}
									/>
								</div>
							</div>

							{/* Monto Total */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Monto Total <span className="text-red-500">*</span>
								</label>
								<Input
									type="number"
									name="monto_total"
									value={formData.monto_total || ''}
									onChange={handleChange}
									placeholder="0.00"
									step="0.01"
									error={errors.monto_total}
								/>
								{errors.monto_total && (
									<p className="mt-1 text-sm text-red-600">{errors.monto_total}</p>
								)}
							</div>

							{/* Estado */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Estado <span className="text-red-500">*</span>
								</label>
								<Select
									name="estado"
									value={formData.estado || ''}
									onChange={handleChange}
									error={errors.estado}
								>
									<option value="Pendiente">Pendiente</option>
									<option value="Pagado">Pagado</option>
								</Select>
							</div>

							{/* Fecha Pago - Conditional */}
							{formData.estado === 'Pagado' && (
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Fecha de Pago
									</label>
									<Input
										type="date"
										name="fecha_pago"
										value={formData.fecha_pago || ''}
										onChange={handleChange}
										error={errors.fecha_pago}
									/>
								</div>
							)}

							{/* Actions */}
							<div className="flex gap-4">
								<Button
									type="submit"
									variant="primary"
									disabled={submitting}
									className="flex items-center gap-2"
								>
									<Save size={18} />
									{submitting ? 'Creando...' : 'Crear Compra'}
								</Button>
								<Button
									type="button"
									variant="secondary"
									onClick={() => navigate('/compras')}
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
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<Package className="text-primary-600 mt-1" size={20} />
								<div>
									<p className="font-medium text-gray-800 mb-1">
										Registrar Recepción
									</p>
									<p className="text-sm text-gray-600">
										Ingresa los datos de la mercadería recibida del proveedor.
									</p>
								</div>
							</div>

							<div className="border-t border-gray-200 pt-4">
								<p className="text-sm font-medium text-gray-700 mb-2">
									Campos Requeridos:
								</p>
								<ul className="text-sm text-gray-600 space-y-1">
									<li>• Número de Pedido</li>
									<li>• Fecha de Recepción</li>
									<li>• Monto Total</li>
									<li>• Estado</li>
								</ul>
							</div>

							<div className="border-t border-gray-200 pt-4">
								<p className="text-sm text-gray-600">
									<strong>Nota:</strong> Asegúrate de que el número de pedido exista y
									esté en estado "Entregado".
								</p>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default CompraForm;
