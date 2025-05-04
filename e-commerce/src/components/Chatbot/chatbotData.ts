export interface ChatbotMessage {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface FAQ {
  question: string;
  answer: string;
  keywords: string[];
}

export const faqs: FAQ[] = [
  {
    question: "Comment puis-je passer une commande ?",
    answer: "Pour passer une commande, parcourez notre catalogue, ajoutez les produits souhaités à votre panier, puis cliquez sur 'Passer à la caisse'. Suivez les instructions pour entrer vos informations de livraison et de paiement.",
    keywords: ["commande", "commander", "acheter", "achat", "panier", "caisse", "passer"]
  },
  {
    question: "Quels sont les modes de paiement acceptés ?",
    answer: "Nous acceptons les paiements par carte bancaire (Visa, Mastercard), Mobile Money (Orange Money, MTN Mobile Money), et les paiements à la livraison dans certaines zones.",
    keywords: ["paiement", "payer", "carte", "bancaire", "mobile", "money", "livraison"]
  },
  {
    question: "Combien de temps faut-il pour livrer ma commande ?",
    answer: "Le délai de livraison dépend de votre localisation. Pour Yaoundé, la livraison prend généralement 1-2 jours ouvrables. Pour les autres villes du Cameroun, comptez 3-5 jours ouvrables.",
    keywords: ["livraison", "délai", "temps", "jours", "quand", "recevoir"]
  },
  {
    question: "Comment puis-je suivre ma commande ?",
    answer: "Vous pouvez suivre votre commande en vous connectant à votre compte et en visitant la section 'Mes commandes'. Vous y trouverez le statut actuel de votre commande et les informations de suivi.",
    keywords: ["suivre", "suivi", "statut", "commande", "tracking", "où"]
  },
  {
    question: "Quelle est votre politique de retour ?",
    answer: "Vous pouvez retourner un produit dans les 7 jours suivant la réception si celui-ci est défectueux ou ne correspond pas à la description. Contactez notre service client pour initier un retour.",
    keywords: ["retour", "retourner", "rembourser", "remboursement", "défectueux", "échange"]
  },
  {
    question: "Comment puis-je contacter le service client ?",
    answer: "Vous pouvez contacter notre service client par email à support@enspy-ecommerce.com, par téléphone au +237 6XX XX XX XX, ou via le formulaire de contact sur notre site.",
    keywords: ["contact", "contacter", "service", "client", "aide", "assistance", "email", "téléphone"]
  },
  {
    question: "Comment créer un compte ?",
    answer: "Pour créer un compte, cliquez sur 'Se connecter' en haut à droite de la page, puis sur 'Créer un compte'. Remplissez le formulaire avec vos informations personnelles et suivez les instructions.",
    keywords: ["compte", "créer", "inscription", "inscrire", "enregistrer", "s'inscrire"]
  },
  {
    question: "Les produits sont-ils garantis ?",
    answer: "Oui, tous nos produits sont garantis selon les conditions du fabricant. La durée de garantie varie selon le type de produit et est indiquée sur la page de chaque produit.",
    keywords: ["garantie", "garanti", "garantis", "assurance", "qualité", "durée"]
  },
  {
    question: "Puis-je annuler ma commande ?",
    answer: "Vous pouvez annuler votre commande si elle n'a pas encore été expédiée. Connectez-vous à votre compte, accédez à 'Mes commandes' et cliquez sur 'Annuler' si cette option est disponible.",
    keywords: ["annuler", "annulation", "cancel", "supprimer", "commande"]
  },
  {
    question: "Comment puis-je ajouter un produit à mes favoris ?",
    answer: "Pour ajouter un produit à vos favoris, cliquez sur l'icône en forme de cœur située sur la carte du produit ou sur sa page détaillée. Vous devez être connecté à votre compte pour utiliser cette fonctionnalité.",
    keywords: ["favoris", "favori", "ajouter", "sauvegarder", "cœur", "wishlist", "liste"]
  },
  {
    question: "Proposez-vous des réductions pour les étudiants ?",
    answer: "Oui, nous offrons des réductions spéciales pour les étudiants de l'ENSPY et d'autres établissements. Présentez votre carte d'étudiant lors de la livraison ou contactez notre service client pour plus d'informations.",
    keywords: ["réduction", "étudiant", "remise", "discount", "promo", "promotion", "spécial"]
  },
  {
    question: "Comment puis-je devenir vendeur sur votre plateforme ?",
    answer: "Pour devenir vendeur, cliquez sur 'Devenir vendeur' en bas de page et remplissez le formulaire d'inscription. Notre équipe examinera votre demande et vous contactera dans un délai de 48 heures.",
    keywords: ["vendeur", "vendre", "boutique", "magasin", "devenir", "inscription", "seller"]
  }
];

export const greetings = [
  "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
  "Bienvenue sur ENSPY E-Commerce ! Que puis-je faire pour vous ?",
  "Salut ! Je suis là pour répondre à vos questions. Comment puis-je vous aider ?",
  "Bonjour et bienvenue ! Posez-moi vos questions sur nos produits ou services."
];

export const fallbackResponses = [
  "Je ne suis pas sûr de comprendre votre question. Pourriez-vous la reformuler ?",
  "Désolé, je n'ai pas de réponse à cette question. Voulez-vous contacter notre service client ?",
  "Je n'ai pas trouvé d'information sur ce sujet. Essayez de poser votre question différemment ou contactez notre équipe.",
  "Cette question est un peu complexe pour moi. Pourriez-vous être plus précis ou contacter notre service client ?"
];

export const suggestions = [
  "Comment passer une commande ?",
  "Modes de paiement acceptés",
  "Délais de livraison",
  "Politique de retour",
  "Contacter le service client"
];
