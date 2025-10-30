import React, { useState } from 'react';
import { useStore } from '../../../lib/store';
import { CartItem } from '../../../lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { 
  UtensilsCrossed, 
  Wine, 
  Cookie,
  Flame,
  Clock,
  ChefHat
} from 'lucide-react';

interface CoursesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type CourseType = 'appetizer' | 'main' | 'dessert' | 'beverage' | null;

export function CoursesDialog({ open, onOpenChange }: CoursesDialogProps) {
  const { cart, setItemCourse, fireOrderToKitchen, currentShift } = useStore();
  const [firedCourses, setFiredCourses] = useState<Set<CourseType>>(new Set());
  
  const courses: { type: CourseType; label: string; icon: any }[] = [
    { type: 'beverage', label: 'Beverages', icon: Wine },
    { type: 'appetizer', label: 'Appetizers', icon: Cookie },
    { type: 'main', label: 'Main Courses', icon: UtensilsCrossed },
    { type: 'dessert', label: 'Desserts', icon: Cookie },
  ];
  
  const getCourseItems = (course: CourseType) => {
    return cart.items.filter(item => item.course === course);
  };
  
  const getUnassignedItems = () => {
    return cart.items.filter(item => !item.course);
  };
  
  const handleAssignCourse = (itemId: string, course: CourseType) => {
    setItemCourse(itemId, course);
  };
  
  const handleFireCourse = (course: CourseType) => {
    // In a real app, this would send only the course items to the kitchen
    // For now, we'll just mark the course as fired
    setFiredCourses(prev => new Set(prev).add(course));
    
    // Show a toast notification
    console.log(`Fired ${course} course to kitchen`);
  };
  
  const canFireCourse = (course: CourseType) => {
    const items = getCourseItems(course);
    return items.length > 0 && !firedCourses.has(course);
  };
  
  const getCourseIcon = (course: CourseType) => {
    const courseData = courses.find(c => c.type === course);
    return courseData?.icon || UtensilsCrossed;
  };
  
  const getCourseColor = (course: CourseType) => {
    switch (course) {
      case 'beverage': return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
      case 'appetizer': return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200';
      case 'main': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      case 'dessert': return 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200';
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Course Management
          </DialogTitle>
          <DialogDescription>
            Organize items by course and fire them to the kitchen at the right time
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Unassigned Items */}
          {getUnassignedItems().length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Unassigned Items
              </h3>
              <div className="grid gap-2">
                {getUnassignedItems().map((item) => (
                  <div key={item.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {item.quantity}x {item.product.name}
                          </span>
                          {item.variation && (
                            <Badge variant="secondary">{item.variation.name}</Badge>
                          )}
                        </div>
                        {item.modifiers.length > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.modifiers.map(m => m.name).join(', ')}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-1">
                        {courses.map(({ type, label }) => (
                          <Button
                            key={type}
                            size="sm"
                            variant="outline"
                            onClick={() => handleAssignCourse(item.id, type)}
                            title={label}
                          >
                            {React.createElement(getCourseIcon(type), { className: 'h-4 w-4' })}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Course Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map(({ type, label, icon: Icon }) => {
              const items = getCourseItems(type);
              const isFired = firedCourses.has(type);
              
              return (
                <div key={type} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <h3 className="font-medium">{label}</h3>
                      <Badge variant="secondary">{items.length}</Badge>
                    </div>
                    {isFired && (
                      <Badge variant="default" className="bg-green-500">
                        <Flame className="h-3 w-3 mr-1" />
                        Fired
                      </Badge>
                    )}
                  </div>
                  
                  {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      No items in this course
                    </p>
                  ) : (
                    <>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className={`rounded-md p-2 ${getCourseColor(type)}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">
                                    {item.quantity}x {item.product.name}
                                  </span>
                                  {item.variation && (
                                    <Badge variant="outline" className="text-xs">
                                      {item.variation.name}
                                    </Badge>
                                  )}
                                </div>
                                {item.modifiers.length > 0 && (
                                  <p className="text-xs opacity-75 mt-1">
                                    {item.modifiers.map(m => m.name).join(', ')}
                                  </p>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleAssignCourse(item.id, null)}
                                className="h-6 px-2"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Button
                        className="w-full"
                        size="sm"
                        onClick={() => handleFireCourse(type)}
                        disabled={!canFireCourse(type)}
                      >
                        {isFired ? (
                          <>
                            <Flame className="h-4 w-4 mr-2" />
                            Already Fired
                          </>
                        ) : (
                          <>
                            <Flame className="h-4 w-4 mr-2" />
                            Fire to Kitchen
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Fire All Button */}
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Fire All Courses at Once</p>
              <p className="text-sm text-muted-foreground">
                Send all assigned items to the kitchen immediately
              </p>
            </div>
            <Button
              onClick={() => {
                courses.forEach(({ type }) => {
                  if (canFireCourse(type)) {
                    handleFireCourse(type);
                  }
                });
              }}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Flame className="h-4 w-4 mr-2" />
              Fire All
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
