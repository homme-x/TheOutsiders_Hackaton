'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  const teamMembers = [
    {
      name: "Steve",
      role: "Développeur Full Stack",
      image: "/images/team/member1.jpg"
    },
    {
      name: "Member 2",
      role: "Développeur Front-end",
      image: "/images/team/member2.jpg"
    },
    {
      name: "Member 3",
      role: "Développeur Back-end",
      image: "/images/team/member3.jpg"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-16"
    >
      <div className="enspy-container">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">À propos de nous</h1>
          <p className="text-lg text-gray-600 mb-8">
            Bienvenue sur ENSPY Store, une initiative créée dans le cadre du Hackathon 2024-2025 
            du Club Génie Informatique de l&apos;ENSPY.
          </p>
          <div className="bg-primary/5 p-6 rounded-lg mb-12">
            <p className="text-gray-700">
              En tant qu&apos;étudiants en 4ème année à l&apos;École Nationale Supérieure Polytechnique 
              de Yaoundé (ENSPY), nous sommes passionnés par l&apos;informatique et le développement. 
              Notre équipe de trois développeurs s&apos;est réunie pour créer une solution innovante 
              répondant aux besoins de notre communauté estudiantine.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-lg shadow-md p-6 text-center"
            >
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Notre Vision</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-700 mb-4">
              ENSPY Store est né de notre désir de simplifier l&apos;accès aux fournitures et 
              équipements essentiels pour les étudiants. Notre plateforme combine :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Une expérience d&apos;achat intuitive</li>
              <li>Des solutions de paiement adaptées au contexte local</li>
              <li>Un service client réactif</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
