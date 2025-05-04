import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="enspy-footer">
      <div className="enspy-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="relative h-10 w-10 mr-2">
                <Image 
                  src="/images/enspy.jpg" 
                  alt="Logo ENSPY" 
                  width={40} 
                  height={40}
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold primary-text">ENSPY E-Commerce</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Plateforme de commerce en ligne dédiée aux étudiants et vendeurs de l&apos;École Nationale Supérieure Polytechnique de Yaoundé.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold primary-text mb-4">Catégories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop/categories/fournitures" className="text-gray-600 hover:text-primary">
                  Fournitures scolaires
                </Link>
              </li>
              <li>
                <Link href="/shop/categories/manuels" className="text-gray-600 hover:text-primary">
                  Manuels et papeterie
                </Link>
              </li>
              <li>
                <Link href="/shop/categories/vetements" className="text-gray-600 hover:text-primary">
                  Vêtements et accessoires
                </Link>
              </li>
              <li>
                <Link href="/shop/categories/alimentation" className="text-gray-600 hover:text-primary">
                  Alimentation et boissons
                </Link>
              </li>
              <li>
                <Link href="/shop/categories/billets" className="text-gray-600 hover:text-primary">
                  Billets et événements
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold primary-text mb-4">Liens Utiles</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/login" className="text-gray-600 hover:text-primary">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-gray-600 hover:text-primary">
                  Inscription
                </Link>
              </li>
              <li>
                <Link href="/shop/cart" className="text-gray-600 hover:text-primary">
                  Panier
                </Link>
              </li>
              <li>
                <Link href="/shop/orders" className="text-gray-600 hover:text-primary">
                  Mes commandes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold primary-text mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">
                <strong>Adresse:</strong> ENSPY, Yaoundé, Cameroun
              </li>
              <li className="text-gray-600">
                <strong>Email:</strong> contact@enspy-ecommerce.com
              </li>
              <li className="text-gray-600">
                <strong>Téléphone:</strong> +237 XXX XXX XXX
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} ENSPY E-Commerce. Tous droits réservés.</p>
          <p className="mt-2">
            <Link href="/privacy-policy" className="text-gray-600 hover:text-primary">
              Politique de confidentialité
            </Link>{' '}
            |{' '}
            <Link href="/terms-of-service" className="text-gray-600 hover:text-primary">
              Conditions d&apos;utilisation
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
