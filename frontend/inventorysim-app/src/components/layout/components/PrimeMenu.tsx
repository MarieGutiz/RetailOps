
import { usePrimeLayout } from './PrimeLayoutProvider'
import { usePrimeLayoutStore } from '../hooks/usePrimeLayout'
import Menu from './menu/Menu'
import { DraggableSidebar } from './draggable/DraggableSidebar'
import type { PrimeLayoutController } from '../controllers/PrimeLayoutController'


const PrimeMenu = ({
  controller,
}: {
  controller?: PrimeLayoutController;
}) => {
  const layout = usePrimeLayout(); // always defined
  const pinned = usePrimeLayoutStore(l => l.pinned);
  const side = usePrimeLayoutStore(l => l.side);
  const variant = layout.getVariant();

  // Use whichever source is available (context takes priority)
  const activeController = controller ?? layout;

  if (pinned) {
    activeController.resetPosition();
    return <Menu variant={variant} side={side} />;
  }

  // Unpinned: floating and draggable
  return (
    <DraggableSidebar controller={activeController}>
      <Menu variant={variant} side={side} />
    </DraggableSidebar>
  );
};

export default PrimeMenu;