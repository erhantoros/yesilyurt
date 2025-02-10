import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  description?: string;
}

export function ImageModal({ isOpen, onClose, imageUrl, title, description }: ImageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        <div className="relative">
          <img
            src={imageUrl}
            alt={title || 'Resim'}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          {(title || description) && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
              {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
              {description && <p className="text-sm">{description}</p>}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}