import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Users, Shield, RefreshCw, KeyRound } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { DataTable } from './DataTable';
import { ColumnDef } from '@tanstack/react-table';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  pin: string;
  role: 'cashier' | 'manager' | 'admin';
  email: string;
  permissions: string[];
}

// Mock users data
const mockUsers: UserData[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    pin: '123456',
    role: 'cashier',
    email: 'john@example.com',
    permissions: ['process_sales', 'view_products'],
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    name: 'Jane Smith',
    pin: '567890',
    role: 'manager',
    email: 'jane@example.com',
    permissions: ['process_sales', 'void_items', 'price_override', 'process_returns'],
  },
  {
    id: '3',
    firstName: 'Admin',
    lastName: 'User',
    name: 'Admin User',
    pin: '000000',
    role: 'admin',
    email: 'admin@example.com',
    permissions: ['all'],
  },
];

const availablePermissions = [
  { id: 'process_sales', label: 'Process Sales' },
  { id: 'void_items', label: 'Void Items' },
  { id: 'price_override', label: 'Price Override' },
  { id: 'process_returns', label: 'Process Returns' },
  { id: 'cash_management', label: 'Cash Management' },
  { id: 'view_reports', label: 'View Reports' },
  { id: 'manage_products', label: 'Manage Products' },
  { id: 'manage_users', label: 'Manage Users' },
];

// Generate random 6-digit PIN
const generateRandomPIN = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export function UsersModule() {
  const [users] = useState(mockUsers);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [resetPinUser, setResetPinUser] = useState<UserData | null>(null);
  const [showResetPinDialog, setShowResetPinDialog] = useState(false);
  const [newResetPin, setNewResetPin] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    pin: '',
    role: 'cashier',
    email: '',
    permissions: [] as string[],
  });

  // Auto-generate PIN when creating new user
  useEffect(() => {
    if (showCreateDialog && !editingUser) {
      setFormData(prev => ({
        ...prev,
        pin: generateRandomPIN()
      }));
    }
  }, [showCreateDialog, editingUser]);

  const columns: ColumnDef<UserData>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.original.role;
        return (
          <Badge
            variant={
              role === 'admin'
                ? 'default'
                : role === 'manager'
                ? 'secondary'
                : 'outline'
            }
          >
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'pin',
      header: 'PIN',
      cell: () => <span className="font-mono text-muted-foreground">••••••</span>,
    },
    {
      id: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => {
        const permissions = row.original.permissions;
        return (
          <Badge variant="outline">
            {permissions.length === 1 && permissions[0] === 'all'
              ? 'All Permissions'
              : `${permissions.length} permissions`}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(row.original)}
            title="Edit user"
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleResetPinRequest(row.original)}
            title="Reset PIN"
          >
            <KeyRound className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(row.original)}
            disabled={row.original.role === 'admin'}
            title="Delete user"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ];

  const handleCreate = () => {
    setFormData({
      firstName: '',
      lastName: '',
      pin: generateRandomPIN(),
      role: 'cashier',
      email: '',
      permissions: [],
    });
    setEditingUser(null);
    setShowCreateDialog(true);
  };

  const handleEdit = (user: UserData) => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      pin: user.pin,
      role: user.role,
      email: user.email,
      permissions: user.permissions,
    });
    setEditingUser(user);
    setShowCreateDialog(true);
  };

  const handleSave = () => {
    if (!formData.firstName || !formData.lastName || !formData.pin || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.pin.length !== 6) {
      toast.error('PIN must be exactly 6 digits');
      return;
    }

    if (editingUser) {
      toast.success('User updated successfully');
    } else {
      toast.success('User created successfully');
    }

    setShowCreateDialog(false);
  };

  const handleDelete = (user: UserData) => {
    if (user.role === 'admin') {
      toast.error('Cannot delete admin users');
      return;
    }

    if (confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      toast.success('User deleted successfully');
    }
  };

  const togglePermission = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const regeneratePIN = () => {
    const newPIN = generateRandomPIN();
    setFormData(prev => ({ ...prev, pin: newPIN }));
    toast.success('New PIN generated');
  };

  const handleResetPinRequest = (user: UserData) => {
    setResetPinUser(user);
    setNewResetPin(generateRandomPIN());
    setShowResetPinDialog(true);
  };

  const handleResetPin = () => {
    if (!resetPinUser || newResetPin.length !== 6) {
      toast.error('Invalid PIN');
      return;
    }

    // TODO: Update user PIN in store/database
    toast.success(`PIN reset successfully for ${resetPinUser.name}`, {
      description: `New PIN: ${newResetPin} - Make sure to share this with the user securely.`,
      duration: 10000,
    });
    
    setShowResetPinDialog(false);
    setResetPinUser(null);
    setNewResetPin('');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Users</h2>
          <p className="text-muted-foreground">Manage staff accounts and permissions</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>
            {users.length} user{users.length !== 1 ? 's' : ''} in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            searchKey="name"
            searchPlaceholder="Search users..."
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Edit User' : 'Create New User'}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'Update user information and permissions'
                : 'Add a new staff member to the system'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  PIN (6 digits) <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    maxLength={6}
                    value={formData.pin}
                    onChange={(e) =>
                      setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })
                    }
                    placeholder="123456"
                    className="font-mono"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={regeneratePIN}
                    title="Generate new PIN"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  PIN is automatically generated. Click refresh to generate a new one.
                </p>
              </div>

              <div className="space-y-2">
                <Label>
                  Role <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cashier">Cashier</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Permissions
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {availablePermissions.map((perm) => (
                  <div key={perm.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={perm.id}
                      checked={formData.permissions.includes(perm.id)}
                      onCheckedChange={() => togglePermission(perm.id)}
                    />
                    <Label
                      htmlFor={perm.id}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {perm.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {formData.role === 'admin' && (
              <div className="p-3 bg-primary/10 rounded-lg text-sm">
                <p className="font-medium mb-1">Admin Role</p>
                <p className="text-muted-foreground">
                  Admins have full access to all system features, including user management and
                  settings.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset PIN Dialog */}
      <AlertDialog open={showResetPinDialog} onOpenChange={setShowResetPinDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset User PIN</AlertDialogTitle>
            <AlertDialogDescription>
              Generate a new PIN for {resetPinUser?.name}. The user will need this PIN to log in.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New PIN (6 digits)</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  maxLength={6}
                  value={newResetPin}
                  onChange={(e) => setNewResetPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="font-mono text-center text-lg tracking-widest"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setNewResetPin(generateRandomPIN())}
                  title="Generate new PIN"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                A random PIN has been generated. Click refresh to generate a new one.
              </p>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm font-medium mb-1 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600" />
                Important
              </p>
              <p className="text-xs text-muted-foreground">
                Make sure to securely communicate this new PIN to the user. They will need it to log in and access their account.
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowResetPinDialog(false);
              setResetPinUser(null);
              setNewResetPin('');
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResetPin}
              disabled={newResetPin.length !== 6}
            >
              Reset PIN
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
