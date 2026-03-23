# Bitácora del Proyecto TrueCoin Simids

## Estado Actual (Última actualización: Marzo 2026)
- Estamos organizando el proceso de inicio de sesión y registro VIP.
- Implementamos un botón de "Simular Pago (Modo Prueba)" para facilitar pruebas sin pagos reales.
- **Problema actual:** Al hacer clic en simular pago (o pagar), salta el error: `new row violates row-level security policy for table "transactions"`.
- **Siguiente paso:** Necesitamos ajustar las políticas de seguridad (RLS) en la base de datos de Supabase para la tabla `transactions`, de modo que permita insertar transacciones desde el frontend.
