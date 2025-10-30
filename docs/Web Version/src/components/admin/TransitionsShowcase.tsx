import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import {
  ModalTransition,
  DrawerTransition,
  DropdownTransition,
  CollapseTransition,
} from '../animated/ModalTransition';
import { TabTransition, AccordionTransition, FlipCard } from '../animated/TabTransition';
import { PageTransition } from '../animated/PageTransition';
import {
  ChevronDown,
  ChevronUp,
  X,
  Menu,
  CreditCard,
  User,
  Settings as SettingsIcon,
  RotateCw,
} from 'lucide-react';

export function TransitionsShowcase() {
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerSide, setDrawerSide] = useState<'left' | 'right' | 'top' | 'bottom'>('right');

  // Tab states
  const [activeTab, setActiveTab] = useState('tab1');
  const [pageTab, setPageTab] = useState('page1');

  // Accordion states
  const [accordion1Open, setAccordion1Open] = useState(false);
  const [accordion2Open, setAccordion2Open] = useState(false);
  const [accordion3Open, setAccordion3Open] = useState(false);

  // Collapse states
  const [collapseOpen, setCollapseOpen] = useState(false);

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Flip card state
  const [cardFlipped, setCardFlipped] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2">Transitions Showcase</h1>
        <p className="text-muted-foreground">
          Preview all page transitions, modals, and animated UI patterns
        </p>
      </div>

      <Tabs defaultValue="modals">
        <TabsList>
          <TabsTrigger value="modals">Modals & Drawers</TabsTrigger>
          <TabsTrigger value="tabs">Tabs & Pages</TabsTrigger>
          <TabsTrigger value="accordion">Accordion & Collapse</TabsTrigger>
          <TabsTrigger value="dropdowns">Dropdowns</TabsTrigger>
          <TabsTrigger value="flip">Flip Cards</TabsTrigger>
        </TabsList>

        {/* Modals & Drawers */}
        <TabsContent value="modals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Modal Transitions</CardTitle>
              <CardDescription>Dialog and modal animations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Standard Modal</h3>
                <Button onClick={() => setShowModal(true)}>
                  Open Modal
                </Button>
              </div>

              <ModalTransition isOpen={showModal} onClose={() => setShowModal(false)}>
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Modal Dialog</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowModal(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      This modal uses spring-based animations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      The modal content animates in with a scale and slide effect,
                      while the backdrop fades in smoothly.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={() => setShowModal(false)}>
                        Confirm
                      </Button>
                      <Button variant="outline" onClick={() => setShowModal(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </ModalTransition>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Drawer Transitions</CardTitle>
              <CardDescription>Side panel slide-in animations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Choose Drawer Side</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant={drawerSide === 'left' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDrawerSide('left')}
                  >
                    Left
                  </Button>
                  <Button
                    variant={drawerSide === 'right' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDrawerSide('right')}
                  >
                    Right
                  </Button>
                  <Button
                    variant={drawerSide === 'top' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDrawerSide('top')}
                  >
                    Top
                  </Button>
                  <Button
                    variant={drawerSide === 'bottom' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDrawerSide('bottom')}
                  >
                    Bottom
                  </Button>
                </div>
                <Button onClick={() => setShowDrawer(true)}>
                  <Menu className="w-4 h-4 mr-2" />
                  Open Drawer ({drawerSide})
                </Button>
              </div>

              <DrawerTransition
                isOpen={showDrawer}
                onClose={() => setShowDrawer(false)}
                side={drawerSide}
              >
                <div className="p-6 w-80 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Drawer Content</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowDrawer(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    This drawer slides in from the {drawerSide} with spring physics.
                  </p>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <SettingsIcon className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Billing
                    </Button>
                  </div>
                </div>
              </DrawerTransition>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tabs & Pages */}
        <TabsContent value="tabs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tab Transitions</CardTitle>
              <CardDescription>Smooth content switching</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button
                  variant={activeTab === 'tab1' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('tab1')}
                >
                  Tab 1
                </Button>
                <Button
                  variant={activeTab === 'tab2' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('tab2')}
                >
                  Tab 2
                </Button>
                <Button
                  variant={activeTab === 'tab3' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('tab3')}
                >
                  Tab 3
                </Button>
              </div>

              <TabTransition activeTab={activeTab} direction="horizontal">
                <Card>
                  <CardContent className="p-6">
                    {activeTab === 'tab1' && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Tab 1 Content</h3>
                        <p className="text-sm text-muted-foreground">
                          Content slides horizontally with opacity fade.
                          The animation uses spring physics for natural motion.
                        </p>
                      </div>
                    )}
                    {activeTab === 'tab2' && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Tab 2 Content</h3>
                        <p className="text-sm text-muted-foreground">
                          Each tab transition is independent and smooth.
                          Notice how the content doesn't jump or flash.
                        </p>
                      </div>
                    )}
                    {activeTab === 'tab3' && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Tab 3 Content</h3>
                        <p className="text-sm text-muted-foreground">
                          The exit animation is slightly faster than enter,
                          creating a responsive feel.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabTransition>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Page Transitions</CardTitle>
              <CardDescription>Different transition types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant={pageTab === 'page1' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPageTab('page1')}
                >
                  Fade Up
                </Button>
                <Button
                  variant={pageTab === 'page2' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPageTab('page2')}
                >
                  Slide Right
                </Button>
                <Button
                  variant={pageTab === 'page3' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPageTab('page3')}
                >
                  Scale
                </Button>
              </div>

              {pageTab === 'page1' && (
                <PageTransition transitionKey="page1" type="fadeUp">
                  <Card>
                    <CardContent className="p-6">
                      <Badge className="mb-3">Fade Up</Badge>
                      <p className="text-sm text-muted-foreground">
                        Content fades in while moving up slightly. Great for general page transitions.
                      </p>
                    </CardContent>
                  </Card>
                </PageTransition>
              )}

              {pageTab === 'page2' && (
                <PageTransition transitionKey="page2" type="slideRight">
                  <Card>
                    <CardContent className="p-6">
                      <Badge className="mb-3">Slide Right</Badge>
                      <p className="text-sm text-muted-foreground">
                        Content slides in from the right. Perfect for forward navigation.
                      </p>
                    </CardContent>
                  </Card>
                </PageTransition>
              )}

              {pageTab === 'page3' && (
                <PageTransition transitionKey="page3" type="scale">
                  <Card>
                    <CardContent className="p-6">
                      <Badge className="mb-3">Scale</Badge>
                      <p className="text-sm text-muted-foreground">
                        Content scales in with spring physics. Attention-grabbing but subtle.
                      </p>
                    </CardContent>
                  </Card>
                </PageTransition>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accordion & Collapse */}
        <TabsContent value="accordion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accordion Transitions</CardTitle>
              <CardDescription>Expandable content sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Accordion Item 1 */}
              <div className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setAccordion1Open(!accordion1Open)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent transition-colors"
                >
                  <span className="font-medium">Section 1: Getting Started</span>
                  {accordion1Open ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                <AccordionTransition isOpen={accordion1Open}>
                  <div className="px-4 py-3 border-t border-border bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                      This is expandable content that animates smoothly. The height
                      transitions with easing, and opacity fades in with a slight delay.
                    </p>
                  </div>
                </AccordionTransition>
              </div>

              {/* Accordion Item 2 */}
              <div className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setAccordion2Open(!accordion2Open)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent transition-colors"
                >
                  <span className="font-medium">Section 2: Advanced Features</span>
                  {accordion2Open ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                <AccordionTransition isOpen={accordion2Open}>
                  <div className="px-4 py-3 border-t border-border bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-2">
                      Each accordion item is independent. You can have multiple open at once.
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>Feature A</li>
                      <li>Feature B</li>
                      <li>Feature C</li>
                    </ul>
                  </div>
                </AccordionTransition>
              </div>

              {/* Accordion Item 3 */}
              <div className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setAccordion3Open(!accordion3Open)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent transition-colors"
                >
                  <span className="font-medium">Section 3: FAQ</span>
                  {accordion3Open ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                <AccordionTransition isOpen={accordion3Open}>
                  <div className="px-4 py-3 border-t border-border bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                      The animations are optimized to avoid layout shift and maintain
                      60fps performance even with complex content.
                    </p>
                  </div>
                </AccordionTransition>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collapse Transition</CardTitle>
              <CardDescription>Show/hide content with animation</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setCollapseOpen(!collapseOpen)} className="mb-3">
                {collapseOpen ? 'Hide' : 'Show'} Details
              </Button>

              <CollapseTransition isOpen={collapseOpen}>
                <div className="p-4 border border-border rounded-lg bg-muted/30">
                  <h4 className="font-medium mb-2">Additional Information</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    This content animates height from 0 to auto smoothly.
                    The collapse component uses AnimatePresence for enter/exit animations.
                  </p>
                  <div className="flex gap-2">
                    <Badge>Tag 1</Badge>
                    <Badge>Tag 2</Badge>
                    <Badge>Tag 3</Badge>
                  </div>
                </div>
              </CollapseTransition>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dropdowns */}
        <TabsContent value="dropdowns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dropdown Transitions</CardTitle>
              <CardDescription>Menu and select animations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative inline-block">
                <Button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  variant="outline"
                >
                  {dropdownOpen ? 'Close' : 'Open'} Dropdown
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>

                <DropdownTransition isOpen={dropdownOpen}>
                  <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10">
                    <div className="py-1">
                      <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors">
                        Profile Settings
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors">
                        Preferences
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors">
                        Keyboard Shortcuts
                      </button>
                      <div className="border-t border-border my-1" />
                      <button className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </div>
                </DropdownTransition>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flip Cards */}
        <TabsContent value="flip" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Flip Card Transition</CardTitle>
              <CardDescription>3D card flip effect</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm">
                <Button
                  onClick={() => setCardFlipped(!cardFlipped)}
                  className="mb-4"
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Flip Card
                </Button>

                <div className="h-64">
                  <FlipCard
                    isFlipped={cardFlipped}
                    frontContent={
                      <Card className="h-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        <CardContent className="flex flex-col items-center justify-center h-full">
                          <div className="text-center">
                            <div className="text-4xl font-bold mb-2">Front Side</div>
                            <p className="text-sm opacity-90">
                              Click the button to flip this card
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    }
                    backContent={
                      <Card className="h-full bg-gradient-to-br from-green-500 to-teal-600 text-white">
                        <CardContent className="flex flex-col items-center justify-center h-full">
                          <div className="text-center">
                            <div className="text-4xl font-bold mb-2">Back Side</div>
                            <p className="text-sm opacity-90">
                              The card rotates in 3D space with perspective
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
