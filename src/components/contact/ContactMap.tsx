'use client';

import { useRef, useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import AnimatedSection from '@/components/shared/AnimatedSection';
import AnimatedText from '@/components/shared/AnimatedText';

// Configurações do mapa
const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: -23.5646111,
  lng: -46.6549949,
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
};

const ContactMap = () => {
  const ref = useRef(null);
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);

  const onMarkerClick = useCallback(() => {
    setIsInfoWindowOpen(true);
  }, []);

  const onInfoWindowClose = useCallback(() => {
    setIsInfoWindowOpen(false);
  }, []);

  // Chave de API do Google Maps (em produção, deve ser armazenada em variáveis de ambiente)
  // Nota: Esta é uma chave fictícia para demonstração
  const googleMapsApiKey = 'YOUR_API_KEY';

  return (
    <section ref={ref} className="py-16 bg-gray-100 dark:bg-gray-900">
      <div className="container-section">
        <AnimatedSection className="text-center mb-12" direction="up">
          <AnimatedText
            text="Nossa Localização"
            className="heading-secondary text-black dark:text-white mb-4"
          />
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Estamos localizados no coração de São Paulo, com fácil acesso por transporte
            público e estacionamento nas proximidades.
          </p>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={0.2}>
          <div className="rounded-lg overflow-hidden shadow-lg h-[500px]">
            {/* Fallback para iframe caso a API do Google Maps não esteja disponível */}
            {googleMapsApiKey === 'YOUR_API_KEY' ? (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0976951333184!2d-46.65499492392046!3d-23.564611060350986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1687456892322!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização da Galharufa"
              ></iframe>
            ) : (
              <LoadScript googleMapsApiKey={googleMapsApiKey}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={16}
                  options={options}
                >
                  <Marker position={center} onClick={onMarkerClick}>
                    {isInfoWindowOpen && (
                      <InfoWindow position={center} onCloseClick={onInfoWindowClose}>
                        <div className="p-2">
                          <h3 className="font-bold text-gray-900">Agência Galharufa</h3>
                          <p className="text-gray-700">Av. Paulista, 1000 - Bela Vista</p>
                          <p className="text-gray-700">São Paulo - SP</p>
                        </div>
                      </InfoWindow>
                    )}
                  </Marker>
                </GoogleMap>
              </LoadScript>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={0.4} className="mt-8 text-center">
          <h3 className="text-xl font-medium text-black dark:text-white mb-2">
            Como Chegar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white dark:bg-black p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-medium text-black dark:text-white mb-3">
                De Metrô
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                Estamos a 5 minutos a pé da estação Brigadeiro (Linha 2-Verde) e a 10
                minutos da estação Trianon-Masp.
              </p>
            </div>

            <div className="bg-white dark:bg-black p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-medium text-black dark:text-white mb-3">
                De Ônibus
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                Diversas linhas de ônibus passam pela Avenida Paulista. Desça no ponto
                próximo ao número 1000.
              </p>
            </div>

            <div className="bg-white dark:bg-black p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-medium text-black dark:text-white mb-3">
                De Carro
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                Estacionamentos disponíveis nas proximidades. Recomendamos o
                estacionamento do Shopping Cidade São Paulo.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ContactMap;
