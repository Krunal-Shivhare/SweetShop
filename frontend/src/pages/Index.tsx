import { SweetShop } from '../components/SweetShop';
import { SweetShopProvider } from '../contexts/SweetShopContext';

const Index = () => {
  return (
    <SweetShopProvider>
      <SweetShop />
    </SweetShopProvider>
  );
};

export default Index;
