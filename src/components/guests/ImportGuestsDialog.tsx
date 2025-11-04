import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

type Segment = 'All' | 'Wedding Party' | 'Out-of-Towners' | 'Parents' | 'Vendors' | string;

interface Guest {
  id: number;
  name: string;
  phone: string;
  segment: Segment;
  status: string;
}

interface ImportGuestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (guests: Omit<Guest, 'id'>[]) => void;
}

export default function ImportGuestsDialog({ open, onOpenChange, onImport }: ImportGuestsDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV or Excel file");
      return;
    }

    setSelectedFile(file);
    toast.success(`File selected: ${file.name}`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const parseCSV = (text: string): Omit<Guest, 'id'>[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    // Skip header row
    const dataLines = lines.slice(1);
    
    return dataLines.map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      return {
        name: values[0] || '',
        phone: values[1] || '',
        segment: (values[2] || 'All') as Segment,
        status: values[3] || 'Active'
      };
    }).filter(guest => guest.name && guest.phone);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      const text = await selectedFile.text();
      const guests = parseCSV(text);

      if (guests.length === 0) {
        toast.error("No valid guest data found in file");
        return;
      }

      onImport(guests);
      toast.success(`Successfully imported ${guests.length} guests`);
      setSelectedFile(null);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to parse file. Please check the format.");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-card">
        <DialogHeader>
          <DialogTitle>Import Guests</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file with guest information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors
              ${isDragging ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}
            `}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports CSV and Excel files (.csv, .xls, .xlsx)
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              className="hidden"
            />
          </div>

          {/* Selected File Display */}
          {selectedFile && (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <FileSpreadsheet className="w-8 h-8 text-accent" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* File Format Info */}
          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
            <Label className="text-sm font-medium">Expected CSV Format:</Label>
            <code className="block text-xs bg-background p-2 rounded border">
              Name, Phone, Segment, Status<br />
              John Doe, +1 555-0100, Wedding Party, Active<br />
              Jane Smith, +1 555-0101, Out-of-Towners, Invited
            </code>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport}
            disabled={!selectedFile}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Guests
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
