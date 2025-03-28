
import React from 'react';
import { AuthHeader } from '@/components/layout/AuthHeader';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { useAuth } from '@/components/auth/AuthProvider'; // Comentado por enquanto, pode ser necessário depois

export default function Index() {
  const navigate = useNavigate();
  // const { user } = useAuth(); // Pode ser usado no AuthHeader ou CTAs específicos

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <AuthHeader hideNavigation={true} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-20 px-4">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Transforme Sua Comunicação Em Vendas com o Mark-10 {/* Placeholder */}
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Atendimento automatizado para garantir respostas rápidas. Sua equipe pode
              atender de qualquer lugar, sem perder a produtividade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* TODO: Ajustar rotas '/demonstracao' e '/planos' conforme necessário */}
              <Button size="lg" onClick={() => navigate('/demonstracao')} className="bg-blue-500 hover:bg-blue-600 text-white">
                Agendar Demonstração
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/planos')} className="border-white text-white hover:bg-white hover:text-blue-900">
                Contratar Agora
              </Button>
            </div>
          </div>
          {/* Image Placeholder */}
          <div className="hidden md:flex justify-center">
            {/* TODO: Substituir por componente de imagem real */}
            <div className="w-full max-w-sm h-64 bg-gray-700/50 rounded-lg flex items-center justify-center text-gray-400 italic">
              [Imagem do Produto Aqui]
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          {/* <h2 className="text-3xl font-bold mb-12">Benefícios</h2> */} {/* Title removed as each card has its own */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Benefício 1: Eficiência */}
            <div className="flex flex-col items-center p-6">
              {/* TODO: Substituir por ícone real */}
              <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Aumento de Eficiência e Produtividade</h3>
              <p className="text-gray-600 text-sm">
                Ao automatizar o atendimento com chatbots 24h e centralizar a comunicação, sua equipe
                pode focar em tarefas mais estratégicas, resultando em uma operação mais ágil e
                produtiva.
              </p>
            </div>
            {/* Benefício 2: Análise */}
            <div className="flex flex-col items-center p-6">
              {/* TODO: Substituir por ícone real */}
              <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">📊</div>
              <h3 className="text-xl font-semibold mb-2">Análise e Otimização de Desempenho</h3>
              <p className="text-gray-600 text-sm">
                Com relatórios detalhados e monitoramento, sua empresa pode acompanhar o desempenho das
                campanhas e atendimento, ajustando estratégias para obter melhores.
              </p>
            </div>
            {/* Benefício 3: Atendimento */}
            <div className="flex flex-col items-center p-6">
              {/* TODO: Substituir por ícone real */}
              <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">❤️</div>
              <h3 className="text-xl font-semibold mb-2">Melhoria no Atendimento</h3>
              <p className="text-gray-600 text-sm">
                A integração com IA permite respostas mais rápidas e personalizadas, garantindo
                um atendimento de alta qualidade e aumentando a satisfação do cliente, o que
                pode gerar mais vendas e fidelização.
              </p>
            </div>
          </div>
          {/* TODO: Adicionar a seção "Benefícios Que Vão Além Do Atendimento" se necessário */}
        </div>
      </section>

      {/* Funcionalidades Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content & List */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center md:text-left">
              Funcionalidades Que Fazem A Diferença
            </h2>
            <ul className="space-y-3 text-gray-700">
              {/* TODO: Usar ícone Check real */}
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✔</span> Gestão Centralizada
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✔</span> Integração com Inteligência Artificial
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✔</span> Integração com Múltiplos Sistemas
              </li>
              {/* TODO: Adicionar mais itens da imagem se houver */}
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✔</span> Redução de Custos Operacionais
              </li>
               <li className="flex items-center">
                <span className="text-green-500 mr-2">✔</span> Acompanhamento Contínuo de Leads
              </li>
               <li className="flex items-center">
                <span className="text-green-500 mr-2">✔</span> Escalabilidade do Atendimento
              </li>
            </ul>
          </div>
          {/* Image Placeholder */}
          <div className="hidden md:flex justify-center">
             {/* TODO: Substituir por componente de imagem real */}
            <div className="w-full max-w-xs h-72 bg-gray-300 rounded-lg flex items-center justify-center text-gray-500 italic">
              [Imagem Ilustrativa Aqui]
            </div>
          </div>
        </div>
      </section>
      
      {/* Depoimentos Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Veja O Que Dizem Nossos Clientes</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Milhares de empresas já transformaram sua comunicação com o Mark-10. Confira como nossa plataforma tem revolucionado o atendimento e impulsionado resultados.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {/* Depoimento 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-left border border-gray-100">
              <div className="flex text-yellow-400 mb-3">
                {/* TODO: Usar ícones de estrela reais */}
                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
              </div>
              <p className="text-gray-700 italic mb-4">
                "Agora podemos enviar promoções e novidades para todos os nossos contatos em questão de minutos. A plataforma é muito intuitiva e o suporte é excelente."
              </p>
              <div className="flex items-center">
                {/* TODO: Substituir por imagem real */}
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">Renata Souza</p>
                  <p className="text-sm text-gray-500">Diretora de Marketing</p>
                </div>
              </div>
            </div>
            {/* Depoimento 2 */}
             <div className="bg-white p-6 rounded-lg shadow-md text-left border border-gray-100">
              <div className="flex text-yellow-400 mb-3">
                 {/* TODO: Usar ícones de estrela reais */}
                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
              </div>
              <p className="text-gray-700 italic mb-4">
                "Com os chatbots 24h, conseguimos reduzir o tempo de resposta e aumentar nossa taxa de conversão em mais de 30%. O Mark-10 tornou nosso atendimento mais eficiente e profissional."
              </p>
              <div className="flex items-center">
                 {/* TODO: Substituir por imagem real */}
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold">Lucas Martins</p>
                  <p className="text-sm text-gray-500">Gestor de Vendas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planos Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Planos Perfeitos Para Suas Necessidades</h2>
          <p className="text-gray-600 mb-12 max-w-xl mx-auto">
            Escolha o plano que mais se adapta ao seu negócio e comece a transformar sua comunicação hoje mesmo.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Plano Básico */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 flex flex-col">
              <h3 className="text-sm font-semibold text-blue-600 mb-2 tracking-wider">PLANO BÁSICO</h3>
              <p className="text-4xl font-bold mb-1">R$99<span className="text-2xl">,90</span><span className="text-lg font-normal text-gray-500">/Mês</span></p>
              <ul className="space-y-3 text-gray-700 my-6 text-left flex-grow">
                {/* TODO: Usar ícone Check real */}
                <li className="flex items-center"><span className="text-blue-500 mr-2">✔</span> 5 atendentes</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✔</span> 1 conexão de WhatsApp</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✔</span> Gestão centralizada de contatos</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✔</span> Chatbot para autoatendimento 24h</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✔</span> Integração com IA para análise de dados</li>
              </ul>
              <Button variant="outline" className="w-full border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white" onClick={() => navigate('/planos/basico')}>
                ESCOLHER PLANO {/* TODO: Adicionar ícone seta */}
              </Button>
            </div>

            {/* Plano Standard (Destaque) */}
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-500 flex flex-col relative">
               <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">MAIS POPULAR</span>
              <h3 className="text-sm font-semibold text-blue-600 mb-2 tracking-wider mt-4">PLANO STANDARD</h3>
              <p className="text-4xl font-bold mb-1">R$159<span className="text-2xl">,90</span><span className="text-lg font-normal text-gray-500">/Mês</span></p>
              <ul className="space-y-3 text-gray-700 my-6 text-left flex-grow">
                 {/* TODO: Usar ícone Check real */}
                <li className="flex items-center"><span className="text-blue-500 mr-2">✔</span> 10 atendentes</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✔</span> 1 conexão de WhatsApp</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✔</span> Chatbot inteligente para autoatendimento</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✔</span> IA para respostas automáticas e personalizadas</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✔</span> Relatórios avançados de desempenho</li>
              </ul>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => navigate('/planos/standard')}>
                ESCOLHER PLANO {/* TODO: Adicionar ícone seta */}
              </Button>
            </div>

            {/* Plano Pro */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 flex flex-col">
              <h3 className="text-sm font-semibold text-blue-600 mb-2 tracking-wider">PLANO PRO</h3>
              <p className="text-4xl font-bold mb-1">R$269<span className="text-2xl">,90</span><span className="text-lg font-normal text-gray-500">/Mês</span></p>
              <ul className="space-y-3 text-gray-700 my-6 text-left flex-grow">
                 {/* TODO: Usar ícone Check real */}
                <li className="flex items-center"><span className="text-blue-500 mr-2">✔</span> 20 atendentes</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✔</span> 1 conexão de WhatsApp</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✔</span> Painel de atendimento integrado</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✔</span> Disparos de mensagens em massa</li>
                <li className="flex items-center"><span className="text-blue-500 mr-2">✔</span> IA avançada para personalização</li>
              </ul>
              <Button variant="outline" className="w-full border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white" onClick={() => navigate('/planos/pro')}>
                ESCOLHER PLANO {/* TODO: Adicionar ícone seta */}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold mb-12 text-center">Perguntas Frequentes</h2>
          <Accordion type="single" collapsible className="w-full">
            {/* FAQ Item 1 */}
            <AccordionItem value="item-1">
              <AccordionTrigger>O que é o Mark-10?</AccordionTrigger>
              <AccordionContent>
                Mark-10 é uma plataforma de gerenciamento de WhatsApp que ajuda empresas a automatizar o atendimento, enviar mensagens em massa e centralizar a comunicação com seus clientes. Nosso sistema também oferece integração com IA para respostas automáticas e personalizadas. {/* Placeholder text */}
              </AccordionContent>
            </AccordionItem>
            {/* FAQ Item 2 */}
            <AccordionItem value="item-2">
              <AccordionTrigger>O Mark-10 é seguro?</AccordionTrigger>
              <AccordionContent>
                Sim, a segurança é nossa prioridade. Utilizamos criptografia e seguimos as melhores práticas para proteger seus dados e conversas. {/* Placeholder text */}
              </AccordionContent>
            </AccordionItem>
             {/* FAQ Item 3 */}
            <AccordionItem value="item-3">
              <AccordionTrigger>Quantos atendentes posso ter em cada plano?</AccordionTrigger>
              <AccordionContent>
                O número de atendentes varia por plano: Básico (5), Standard (10) e Pro (20). Você pode escolher o que melhor se adapta à sua equipe. {/* Placeholder text */}
              </AccordionContent>
            </AccordionItem>
             {/* FAQ Item 4 */}
            <AccordionItem value="item-4">
              <AccordionTrigger>Posso usar o Mark-10 para enviar mensagens em massa via WhatsApp?</AccordionTrigger>
              <AccordionContent>
                Sim, nosso Plano Pro permite o disparo de mensagens em massa, seguindo as políticas do WhatsApp para evitar bloqueios. {/* Placeholder text */}
              </AccordionContent>
            </AccordionItem>
             {/* FAQ Item 5 */}
             <AccordionItem value="item-5">
              <AccordionTrigger>Preciso de conhecimento técnico para usar o Mark-10?</AccordionTrigger>
              <AccordionContent>
                Não, a plataforma foi desenhada para ser intuitiva e fácil de usar, mesmo para quem não tem conhecimento técnico avançado. Oferecemos também suporte para auxiliar na configuração. {/* Placeholder text */}
              </AccordionContent>
            </AccordionItem>
            {/* TODO: Adicionar mais itens do FAQ da imagem */}
             <AccordionItem value="item-6">
              <AccordionTrigger>Como funciona o cancelamento?</AccordionTrigger>
              <AccordionContent>
                Você pode cancelar sua assinatura a qualquer momento diretamente pelo painel de controle, sem burocracia. {/* Placeholder text */}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 py-8 px-4 mt-16">
        <div className="container mx-auto text-center text-sm">
          {/* TODO: Adicionar links relevantes (Termos, Privacidade) se necessário */}
          <p className="mb-2">Mark-10 não possui qualquer relação com as marcas Meta Inc, WhatsApp Inc.</p>
          <p>&copy; {new Date().getFullYear()} Mark-10 | Todos os direitos reservados.</p>
          {/* <p>Logos e marcas são de propriedade de seus respectivos donos.</p> */}
        </div>
      </footer>
    </div>
  );
}
