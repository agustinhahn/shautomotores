const { Lead } = require('../models');
const sendEmail = require('../utils/sendEmail');

const submitLead = async (req, res) => {
    try {
        const { message, htmlMessage, sellerId, vehicleId, name, phone } = req.body;

        // 1. Guardar el Lead en la Base de Datos para auditoría y Dashboard
        let newLead = null;
        try {
            newLead = await Lead.create({
                name: name || 'Interesado Web',
                phone: phone || '',
                message: message,
                vehicle_id: vehicleId,
                source: 'whatsapp_click',
                status: 'new'
            });
        } catch (dbError) {
            console.error('Error saving lead to DB:', dbError.message);
            // No bloqueamos el flujo si falla el guardado en DB
        }

        // 2. Preparar el envío del Email
        // Usamos el email configurado en SMTP_USER como receptor por defecto (administración)
        const targetEmail = process.env.SMTP_USER || 'Sh.automotores01@gmail.com';
        const subject = `Nueva consulta: ${name || 'Cliente'} - SH Automotores`;

        const mailOptions = {
            to: targetEmail,
            subject: subject,
            text: message,
            html: htmlMessage || `<pre style="font-family: sans-serif; white-space: pre-wrap;">${message}</pre>`
        };

        // 3. Enviar el Email de forma asíncrona (no bloqueante)
        sendEmail(mailOptions).catch(emailError => {
            console.error('Failed to send email lead notification:', emailError.message);
        });

        return res.status(200).json({ 
            success: true, 
            message: 'Lead procesado correctamente.',
            leadId: newLead ? newLead.id : null 
        });
    } catch (error) {
        console.error('Error in submitLead:', error);
        return res.status(500).json({ success: false, message: 'Internal server error processing lead.' });
    }
};

module.exports = {
    submitLead
};
