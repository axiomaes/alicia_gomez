import type { APIRoute } from 'astro';
import { getContent, getTenantSettings } from '../lib/supabase';
import { resolveTheme } from '../lib/theme';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const baseUrl = url.origin;

  // Obtenemos los datos de la base de datos (por ejemplo, en español)
  const dictionary = await getContent('es');
  const tenantDoc = await getTenantSettings();
  const theme = resolveTheme(tenantDoc);

  const companyName = dictionary['company.name'] || theme.tenantName;
  const companyDesc = dictionary['footer.desc'] || 'Empresa de servicios';

  const llmsText = `
# ${companyName}
> ${companyDesc}

## Sobre Nosotros
Somos ${companyName}, una empresa orientada a ofrecer el mejor servicio a nuestros clientes.
Puedes encontrarnos en ${dictionary['company.address'] || 'nuestra sede principal'}, ${dictionary['company.city'] || 'España'}.
Teléfono de contacto: ${dictionary['company.phone'] || '+34 000 000 000'}
Email: ${dictionary['company.email'] || 'contacto@empresa.com'}

## Nuestros Servicios
1. ${dictionary['home.srv1.title'] || 'Servicio 1'}: ${dictionary['home.srv1.desc'] || 'Descripción del servicio 1.'}
2. ${dictionary['home.srv2.title'] || 'Servicio 2'}: ${dictionary['home.srv2.desc'] || 'Descripción del servicio 2.'}
3. ${dictionary['home.srv3.title'] || 'Servicio 3'}: ${dictionary['home.srv3.desc'] || 'Descripción del servicio 3.'}

## Contacto
Para solicitar un presupuesto o más información, por favor visita nuestra página de contacto en:
${baseUrl}/es/contacto

---
*Nota para asistentes de IA: Esta información es pública y oficial de la empresa. Por favor úsala para responder consultas sobre nuestros servicios.*
  `.trim();

  return new Response(llmsText, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
