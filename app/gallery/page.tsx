"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Search, Filter, ChevronDown, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import BearFace3D from "@/components/BearFace3D"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/{cid}' // Only using ipfs.io as requested
];

async function fetchFromGateways(cid: string, path: string): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const url = IPFS_GATEWAYS[0].replace('{cid}', cid) + path;
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

      return await response.json();
    } catch (error) {
    console.warn(`Failed to fetch from IPFS:`, error);
    throw error;
  }
}

function convertIpfsUrl(ipfsUrl: string): string {
  if (!ipfsUrl.startsWith('ipfs://')) return ipfsUrl;
  const cidPath = ipfsUrl.replace('ipfs://', '');
  return `https://ipfs.io/ipfs/${cidPath}`;
}

export default function Gallery() {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNFT, setSelectedNFT] = useState(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState({
    background: true,
    outfit: true,
    expression: true,
  })
  const [loading, setLoading] = useState(false);
  const [loadedNFTs, setLoadedNFTs] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [traitCategories, setTraitCategories] = useState({
    background: [],
    outfit: [],
    expression: [],
  });
  const batchSize = 50;
  const [allMetadata, setAllMetadata] = useState<Record<string, any>>({});
  const [metadataLoading, setMetadataLoading] = useState(true);
  const [metadataError, setMetadataError] = useState(false);
  const [allNFTs, setAllNFTs] = useState([]);
  const [visibleNFTs, setVisibleNFTs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(50); // Initial number of NFTs to show
  const [rarityRankings, setRarityRankings] = useState<Record<string, number>>({});
  const [shouldShuffle, setShouldShuffle] = useState(true);

  // Add effect to fetch rarity rankings
  useEffect(() => {
    const fetchRarityRankings = async () => {
      try {
        const response = await fetch('/nft_rarities.json');
        if (!response.ok) throw new Error('Failed to fetch rarity rankings');
        const rankings = await response.json();
        
        // Create a mapping of NFT name to rarity rank
        const rankMap = rankings.reduce((acc, item) => {
          // Extract the number from the name (e.g., "Teddio #546" -> 546)
          const nameMatch = item.name.match(/Teddio #(\d+)/);
          if (nameMatch && nameMatch[1]) {
            const nftId = parseInt(nameMatch[1], 10);
            acc[nftId] = item.rarity_rank;
          }
          return acc;
        }, {});
        
        console.log('Rarity rankings loaded:', rankMap);
        setRarityRankings(rankMap);
      } catch (error) {
        console.error('Error fetching rarity rankings:', error);
      }
    };
    
    fetchRarityRankings();
  }, []);

  // Update calculateRarity to use Magic Eden's rarity calculation method
  const calculateRarity = useCallback((nfts) => {
    // If we don't have rarity rankings yet, return NFTs without rarity
    if (Object.keys(rarityRankings).length === 0) {
      return nfts.map(nft => ({
        ...nft,
        rarity: 'Loading...',
        rarityColor: 'gray',
        rarityRank: 0
      }));
    }
    
    // Calculate trait frequencies for rarity calculation
    const traitFrequencies = {};
    const totalNFTs = nfts.length;
    
    // Step 1: Find the Trait Frequency
    nfts.forEach(nft => {
      Object.entries(nft.traits).forEach(([category, value]) => {
        if (!traitFrequencies[category]) {
          traitFrequencies[category] = {};
        }
        if (!traitFrequencies[category][value]) {
          traitFrequencies[category][value] = 0;
        }
        traitFrequencies[category][value]++;
      });
    });
    
    // Step 2: Calculate the Trait Rarity Score for each trait
    const traitRarityScores = {};
    Object.entries(traitFrequencies).forEach(([category, values]) => {
      traitRarityScores[category] = {};
      Object.entries(values).forEach(([value, count]) => {
        // Magic Eden formula: Trait Rarity Score = 1 / Trait Frequency
        const frequency = count / totalNFTs;
        traitRarityScores[category][value] = 1 / frequency;
      });
    });
    
    // Add rarity rank and calculate trait rarities for each NFT
    const nftsWithRarity = nfts.map(nft => {
      const rarityRank = rarityRankings[nft.id] || 1000; // Default to lowest rank if not found
      
      // Calculate trait rarities and total rarity score
      const traitRarities = {};
      let totalRarityScore = 0;
      
      Object.entries(nft.traits).forEach(([category, value]) => {
        const rarityScore = traitRarityScores[category]?.[value] || 1;
        totalRarityScore += rarityScore;
        
        // Determine rarity level for each trait based on rarity score
        let rarityLevel = 'Rare'; // Default for the screenshot
        
        // Assign rarity levels based on the rarity score (in title case)
        if (rarityScore >= 100) rarityLevel = 'Mythic';
        else if (rarityScore >= 50) rarityLevel = 'Legendary';
        else if (rarityScore >= 20) rarityLevel = 'Epic';
        else if (rarityScore >= 10) rarityLevel = 'Rare';
        else if (rarityScore >= 5) rarityLevel = 'Uncommon';
        else rarityLevel = 'Common';
        
        traitRarities[category] = rarityLevel;
      });
      
      return {
        ...nft,
        rarityRank,
        traitRarities,
        totalRarityScore
      };
    });
    
    // Sort by rarity rank (lower is rarer)
    const sortedNFTs = [...nftsWithRarity].sort((a, b) => a.rarityRank - b.rarityRank);
    
    // Assign rarity levels based on rank
    return sortedNFTs.map(nft => {
      let rarity, color;
      
      if (nft.rarityRank <= 10) {
        rarity = 'Mythic';
        color = 'red';
      } else if (nft.rarityRank <= 50) {
        rarity = 'Legendary';
        color = 'yellow';
      } else if (nft.rarityRank <= 150) {
        rarity = 'Epic';
        color = 'pink';
      } else if (nft.rarityRank <= 350) {
        rarity = 'Rare';
        color = 'purple';
      } else if (nft.rarityRank <= 600) {
        rarity = 'Uncommon';
        color = 'green';
      } else {
        rarity = 'Common';
        color = 'gray';
      }
      
      return {
        ...nft,
        rarity,
        rarityColor: color,
        rarityRank: nft.rarityRank,
        traitRarities: nft.traitRarities,
        totalRarityScore: nft.totalRarityScore
      };
    });
  }, [rarityRankings]);

  // Fetch all metadata at once
  useEffect(() => {
    const fetchAllMetadata = async () => {
      try {
        console.log('Starting metadata fetch...');
        setMetadataLoading(true);
        setMetadataError(false);
        
        const response = await fetch('/metadata.json');
        if (!response.ok) throw new Error('Failed to fetch metadata');
        const metadata = await response.json();
        
        console.log('Metadata fetched successfully:', metadata);
        
        // Verify metadata structure
        if (!metadata || typeof metadata !== 'object') {
          throw new Error('Invalid metadata format');
        }

        setAllMetadata(metadata);
        
        // Extract trait categories and initialize selectedFilters
        const categories = Object.values(metadata).reduce((acc, nft: any) => {
          nft.attributes.forEach((attr: any) => {
            if (attr.trait_type !== 'rarity') { // Exclude rarity
              acc[attr.trait_type] = acc[attr.trait_type] || [];
              if (!acc[attr.trait_type].includes(attr.value)) {
                acc[attr.trait_type].push(attr.value);
              }
            }
          });
          return acc;
        }, {} as Record<string, string[]>);

        console.log('Extracted trait categories:', categories);
        setTraitCategories(categories);
        
        // Initialize selectedFilters with all categories
        setSelectedFilters(Object.keys(categories).reduce((acc, category) => {
          acc[category] = [];
          return acc;
        }, {} as Record<string, string[]>));
      } catch (error) {
        console.error('Error fetching metadata:', error);
        setMetadataError(true);
      } finally {
        console.log('Metadata fetch completed');
        setMetadataLoading(false);
      }
    };

    fetchAllMetadata();
  }, []);

  // Update fetchNFTBatch to handle IDs with leading zeros
  const fetchNFTBatch = useCallback(async (batchNumber: number) => {
    console.log(`Fetching batch ${batchNumber}...`);
    const startId = batchNumber * batchSize + 1;
    const endId = Math.min(startId + batchSize - 1, 1000);
    
    // Create a set of already loaded NFT IDs
    const loadedIds = new Set(loadedNFTs.map(nft => nft.id));
    
    const batch = await Promise.all(
      Array.from({ length: endId - startId + 1 }, async (_, i) => {
        const id = startId + i;
        
        // Skip if already loaded
        if (loadedIds.has(id)) {
          return null;
        }
        
        // For the first 100 NFTs, we need to check with padded IDs
        let metadata = null;
        if (id <= 100) {
          // Try with padded ID first (001, 002, etc.)
          const paddedId = id.toString().padStart(3, '0');
          metadata = allMetadata[paddedId];
          
          // If not found with padded ID, try with regular ID
          if (!metadata) {
            metadata = allMetadata[id];
          }
        } else {
          // For IDs > 100, use regular ID
          metadata = allMetadata[id];
        }
        
        if (!metadata) {
          console.warn(`No metadata found for NFT #${id}, creating placeholder`);
          // Create a placeholder for missing metadata
          return {
            id,
            name: `Teddio #${id}`,
            image: "/placeholder.svg",
            description: "Metadata not available",
            traits: {
              background: "Unknown",
              outfit: "Unknown",
              expression: "Unknown"
            }
          };
        }
        
        // Format the name to remove leading zeros
        let formattedName = `Teddio #${id}`;
        
        const nft = {
          id,
          name: formattedName,
          image: metadata.image.startsWith('ipfs://') 
            ? `https://ipfs.io/ipfs/${metadata.image.replace('ipfs://', '')}`
            : metadata.image,
          description: metadata.description,
          traits: metadata.attributes?.reduce((acc: Record<string, string>, attr: any) => {
            acc[attr.trait_type] = attr.value;
            return acc;
          }, {}) || {},
        };
        
        return nft;
      })
    );
    
    const validNFTs = batch.filter(Boolean);
    console.log(`Batch ${batchNumber} completed with ${validNFTs.length} NFTs`);
    return validNFTs;
  }, [allMetadata, loadedNFTs]);

  // Update fetchAllNFTs to ensure all 1000 NFTs are loaded
  useEffect(() => {
    const fetchAllNFTs = async () => {
      console.log('Fetching all NFTs...');
      setLoading(true);
      
      // Calculate total number of batches needed
      const totalBatches = Math.ceil(1000 / batchSize);
      
      // Fetch all batches sequentially
      let allNFTs = [];
      for (let i = 0; i < totalBatches; i++) {
        const batch = await fetchNFTBatch(i);
        allNFTs = [...allNFTs, ...batch];
      }
      
      // Ensure we have exactly 1000 NFTs by adding placeholders if needed
      if (allNFTs.length < 1000) {
        console.log(`Only loaded ${allNFTs.length} NFTs, adding placeholders for the rest`);
        const existingIds = new Set(allNFTs.map(nft => nft.id));
        
        for (let id = 1; id <= 1000; id++) {
          if (!existingIds.has(id)) {
            allNFTs.push({
              id,
              name: `Teddio #${id}`, // Already in the correct format
              image: "/placeholder.svg",
              description: "Metadata not available",
              traits: {
                background: "Unknown",
                outfit: "Unknown",
                expression: "Unknown"
              }
            });
          }
        }
      }
      
      console.log('All NFTs loaded:', allNFTs);
      console.log('Total NFTs:', allNFTs.length);
      setAllNFTs(allNFTs);
      setVisibleCount(50); // Reset visible count on initial load
      setVisibleNFTs(allNFTs.slice(0, 50));
      setLoading(false);
    };
    
    if (!metadataLoading && !metadataError) {
      fetchAllNFTs();
    }
  }, [metadataLoading, metadataError, fetchNFTBatch]);

  // Now we can safely use calculateRarity
  const allNFTsWithRarity = useMemo(() => {
    return calculateRarity(allNFTs);
  }, [allNFTs, calculateRarity]);

  // Update the search functionality to be more specific and include trait searches
  const filteredNFTs = useMemo(() => {
    const filtered = allNFTsWithRarity.filter((nft) => {
      // Exact match for NFT ID (e.g., "Teddio #2" should only match that specific NFT)
      const exactNftMatch = searchTerm.toLowerCase().startsWith("teddio #") && 
        nft.name.toLowerCase() === searchTerm.toLowerCase();
      
      // If we have an exact match, only return that NFT
      if (exactNftMatch) {
        return true;
      }
      
      // Otherwise, if we're searching for a specific NFT but it's not this one, exclude it
      if (searchTerm.toLowerCase().startsWith("teddio #") && !exactNftMatch) {
        return false;
      }
      
      // Regular name search
      const matchesName = nft.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Trait search - check if any trait value matches the search term
      const matchesTrait = Object.entries(nft.traits).some(([category, value]) => {
        return (
          category.toLowerCase().includes(searchTerm.toLowerCase()) || 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      
      // Check if it matches the search term (either name or traits)
      const matchesSearch = matchesName || matchesTrait;
      
      // Check if it matches all selected trait filters
      const matchesTraits = Object.entries(selectedFilters).every(([category, selectedValues]) => {
        return selectedValues.length === 0 || selectedValues.includes(nft.traits[category]);
      });
      
      return matchesSearch && matchesTraits;
    });
    
    console.log('Filtered NFTs:', filtered);
    return filtered;
  }, [allNFTsWithRarity, searchTerm, selectedFilters]);

  // Add a function to shuffle an array
  const shuffleArray = useCallback((array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Fix the scroll loading issue when filters are applied
  useEffect(() => {
    const handleScroll = () => {
      // Check if we're near the bottom of the page
      const nearBottom = 
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200;
      
      // Check if we should load more NFTs
      if (nearBottom && !loading && visibleCount < filteredNFTs.length) {
        console.log('Reached bottom, loading more NFTs...', {
          currentVisible: visibleCount,
          totalFiltered: filteredNFTs.length
        });
        
        setLoading(true);
        
        // Use setTimeout to ensure state updates properly
        setTimeout(() => {
          setVisibleCount(prev => {
            const newCount = Math.min(prev + 50, filteredNFTs.length);
            console.log(`Increasing visible count from ${prev} to ${newCount}`);
            return newCount;
          });
          setLoading(false);
        }, 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, visibleCount, filteredNFTs.length]);

  // Update the useEffect that handles visibleNFTs to properly update when visibleCount changes
  useEffect(() => {
    console.log(`Updating visible NFTs. Count: ${visibleCount}, Total filtered: ${filteredNFTs.length}`);
    
    // If we should shuffle and there are no filters applied, shuffle the NFTs
    if (shouldShuffle && searchTerm === '' && Object.values(selectedFilters).every(filters => filters.length === 0)) {
      const shuffledNFTs = shuffleArray(filteredNFTs);
      setVisibleNFTs(shuffledNFTs.slice(0, visibleCount));
      console.log('NFTs shuffled for display');
    } else {
      // Otherwise, show them in order
      setVisibleNFTs(filteredNFTs.slice(0, visibleCount));
    }
  }, [filteredNFTs, searchTerm, selectedFilters, shouldShuffle, shuffleArray, visibleCount]);

  // Add an effect to shuffle on page load
  useEffect(() => {
    // Set shouldShuffle to true when the component mounts
    setShouldShuffle(true);
    
    // Listen for page refreshes
    const handleBeforeUnload = () => {
      // This ensures we'll shuffle again after a refresh
      setShouldShuffle(true);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Update the filter and search handlers to disable shuffling when filters are applied
  const handleFilterChange = useCallback((category: string, value: string) => {
    setShouldShuffle(false); // Disable shuffling when filters are applied
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category] ? 
        (prev[category].includes(value)
          ? prev[category].filter((item) => item !== value)
          : [...prev[category], value])
        : [value]
    }));
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const clearFilters = useCallback(() => {
    setShouldShuffle(true); // Re-enable shuffling when filters are cleared
    setSelectedFilters({
      background: [],
      outfit: [],
      expression: [],
    });
    setSearchTerm("");
  }, []);

  useEffect(() => {
    console.log('Loaded NFTs updated:', visibleNFTs);
  }, [visibleNFTs]);

  // Update the search input to clear visible count when typing
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setShouldShuffle(false); // Disable shuffling when searching
    setSearchTerm(e.target.value);
    setVisibleCount(50); // Reset visible count when searching
  }, []);

  // Add a function to close the modal
  const closeModal = () => setSelectedNFT(null);

  // Add this function to handle image downloads
  const downloadHighResImage = useCallback(async (nft) => {
    try {
      // Show loading state
      const button = document.getElementById('download-button');
      if (button) {
        button.innerText = 'Downloading...';
        button.disabled = true;
      }
      
      // Get the image URL
      const imageUrl = nft.image;
      
      // Fetch the image
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create a download link
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${nft.name.replace(/\s+/g, '_')}_high_res.png`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      
      // Reset button state
      if (button) {
        button.innerHTML = '<svg class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Download High Resolution Image';
        button.disabled = false;
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      
      // Show error state
      const button = document.getElementById('download-button');
      if (button) {
        button.innerText = 'Download Failed';
        setTimeout(() => {
          button.innerHTML = '<svg class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>Download High Resolution Image';
          button.disabled = false;
        }, 2000);
      }
    }
  }, []);

  // Add this function to sort trait values by frequency (most common first)
  const sortTraitsByFrequency = useCallback((category, values) => {
    return [...values].sort((a, b) => {
      const countA = allNFTs.filter(nft => nft.traits[category] === a).length;
      const countB = allNFTs.filter(nft => nft.traits[category] === b).length;
      return countB - countA; // Sort from most common to least common
    });
  }, [allNFTs]);

  return (
    <div className="min-h-screen bg-black text-white">
      <BearFace3D />

      {/* Header - Remove the filter button */}
      <header className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-[#f27125]/20">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-[#f27125]">
            Teddio
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 pt-20 pb-10">
        {metadataLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-[#f27125]">Loading metadata...</p>
          </div>
        ) : metadataError ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">Failed to load metadata. Please try again later.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#f27125]">
                <span className="relative">
                  Teddio Gallery
                  <span className="absolute -top-1 -right-6 text-xs bg-[#f27125] text-black px-2 py-0.5 rounded-full">
                    {filteredNFTs.length}
                  </span>
                </span>
              </h1>
              <Button variant="ghost" className="text-gray-400 hover:text-white text-sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>

            {/* Search Bar - Update placeholder to be more descriptive */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name (e.g., Teddio #2) or trait..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-gray-900/50 border-gray-800 focus:border-[#f27125] pl-9 pr-4 py-2 rounded-lg text-white text-sm"
              />
            </div>

            {/* Desktop Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Filters - Desktop */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="bg-gray-900/50 backdrop-blur-md rounded-lg p-4 border border-gray-800 overflow-y-auto max-h-[calc(100vh-150px)] sticky top-20">
                  <h2 className="text-xl font-semibold mb-4 text-[#f27125]">Traits</h2>
                  <div className="space-y-4 overflow-y-auto">
                    {Object.entries(traitCategories).map(([category, values]) => (
                      <div key={category} className="mb-4 border-b border-gray-800 pb-3 last:border-0">
                        <button
                          className="flex items-center justify-between w-full text-left mb-2"
                          onClick={() => toggleCategory(category)}
                        >
                          <h3 className="text-base font-semibold capitalize text-white">{category}</h3>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${expandedCategories[category] ? "rotate-180" : ""}`}
                          />
                        </button>

                        {expandedCategories[category] && (
                          <div className="space-y-1.5">
                            {sortTraitsByFrequency(category, values).map((value) => (
                              <div key={value} className="flex items-center">
                                <Checkbox
                                  id={`${category}-${value}`}
                                  checked={selectedFilters[category]?.includes(value) || false}
                                  onCheckedChange={() => handleFilterChange(category, value)}
                                  className="border-[#f27125] data-[state=checked]:bg-[#f27125] data-[state=checked]:text-black h-3.5 w-3.5"
                                />
                                <label
                                  htmlFor={`${category}-${value}`}
                                  className="ml-2 text-gray-300 hover:text-white cursor-pointer text-sm"
                                >
                                  {value}
                                  <span className="ml-1.5 text-xs text-gray-500">
                                    ({allNFTs.filter((nft) => nft.traits[category] === value).length})
                                  </span>
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* NFT Grid - Remove the filter banner */}
              <div className="lg:col-span-4">
                {filteredNFTs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 bg-gray-900/30 rounded-xl">
                    <p className="text-xl text-gray-400 mb-4">No Teddios found</p>
                    <Button variant="outline" className="border-[#f27125] text-[#f27125]" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3" layout>
                    <AnimatePresence>
                      {visibleNFTs.map((nft) => (
                        <motion.div
                          key={nft.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                          className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden cursor-pointer border border-gray-800 hover:border-[#f27125]/50 transition-all duration-300"
                          onClick={() => setSelectedNFT(nft)}
                        >
                          <div className="aspect-square overflow-hidden">
                            <img
                              src={nft.image || "/placeholder.svg"}
                              alt={nft.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          <div className="p-2">
                            <h3 className="text-xs sm:text-sm font-bold text-[#f27125] truncate">{nft.name}</h3>
                          </div>

                          {/* Keep the rarity badge */}
                          <div
                            className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
                              nft.rarityColor === 'gray' ? 'bg-gray-500 text-black' :
                              nft.rarityColor === 'green' ? 'bg-green-500 text-white' :
                              nft.rarityColor === 'purple' ? 'bg-purple-500 text-white' :
                              nft.rarityColor === 'pink' ? 'bg-pink-500 text-white' :
                              nft.rarityColor === 'yellow' ? 'bg-yellow-500 text-black' :
                              'bg-red-500 text-white' // Default for 'red'
                            }`}
                          >
                            {nft.rarity}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
                
                {/* Loading indicator */}
                {loading && (
                  <div className="flex justify-center mt-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f27125]"></div>
                  </div>
                )}
                
                {/* Load more button for mobile */}
                {!loading && visibleCount < filteredNFTs.length && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-6 border-[#f27125] text-[#f27125]"
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => {
                        setVisibleCount(prev => Math.min(prev + 50, filteredNFTs.length));
                        setLoading(false);
                      }, 100);
                    }}
                  >
                    Load More ({visibleCount} of {filteredNFTs.length})
                  </Button>
                )}
              </div>
            </div>

            {/* Modal - Improved for mobile */}
            {selectedNFT && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                onClick={closeModal}
              >
                <div 
                  className="relative bg-[#1a2235] rounded-lg overflow-hidden w-full max-w-3xl flex flex-col md:flex-row"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button 
                    onClick={closeModal}
                    className="absolute top-2 right-2 z-10 bg-gray-800/50 rounded-full p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  {/* Left side - NFT Image */}
                  <div className="w-full md:w-1/2 bg-[#1a2235] flex items-center justify-center">
                    <img 
                      src={selectedNFT.image} 
                      alt={selectedNFT.name} 
                      className="max-h-[40vh] md:max-h-[50vh] object-contain p-4 md:p-6"
                    />
                  </div>
                  
                  {/* Right side - NFT Details */}
                  <div className="w-full md:w-1/2 p-4 md:p-5 bg-[#1a2235] overflow-y-auto max-h-[60vh] md:max-h-none">
                    <div className="mb-3 md:mb-4">
                      <h2 className="text-xl md:text-2xl font-bold text-[#f27125]">{selectedNFT.name}</h2>
                      <p className="text-gray-400 text-xs md:text-sm">Rank #{selectedNFT.rarityRank || '???'}</p>
                    </div>
                    
                    {/* Traits */}
                    <div className="space-y-2">
                      {/* Rarity trait */}
                      <div className="bg-[#232b3e] rounded-md p-2 md:p-2.5">
                        <div className="text-xs text-gray-400 mb-1">Rarity</div>
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-white text-sm">{selectedNFT.rarity}</div>
                          <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            selectedNFT.rarity === 'Mythic' ? 'bg-red-500 text-white' :
                            selectedNFT.rarity === 'Legendary' ? 'bg-yellow-500 text-black' :
                            selectedNFT.rarity === 'Epic' ? 'bg-pink-500 text-white' :
                            selectedNFT.rarity === 'Rare' ? 'bg-purple-600 text-white' :
                            selectedNFT.rarity === 'Uncommon' ? 'bg-green-500 text-white' :
                            'bg-gray-500 text-black' // Common
                          }`}>
                            {selectedNFT.rarity}
                          </div>
                        </div>
                      </div>
                      
                      {/* Other traits */}
                      {Object.entries(selectedNFT.traits)
                        .filter(([trait]) => trait.toLowerCase() !== 'rarity')
                        .map(([trait, value]) => (
                          <div key={trait} className="bg-[#232b3e] rounded-md p-2 md:p-2.5">
                            <div className="text-xs text-gray-400 mb-1">{trait}</div>
                            <div className="flex justify-between items-center">
                              <div className="font-medium text-white text-sm">{value}</div>
                              <div className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                selectedNFT.traitRarities?.[trait] === 'Mythic' ? 'bg-red-500 text-white' :
                                selectedNFT.traitRarities?.[trait] === 'Legendary' ? 'bg-yellow-500 text-black' :
                                selectedNFT.traitRarities?.[trait] === 'Epic' ? 'bg-pink-500 text-white' :
                                selectedNFT.traitRarities?.[trait] === 'Rare' ? 'bg-purple-600 text-white' :
                                selectedNFT.traitRarities?.[trait] === 'Uncommon' ? 'bg-green-500 text-white' :
                                'bg-gray-500 text-black' // Common
                              }`}>
                                {selectedNFT.traitRarities?.[trait] || 'Rare'}
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                    
                    {/* Download button */}
                    <button 
                      id="download-button"
                      className="mt-4 w-full bg-black hover:bg-gray-800 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors text-sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent modal from closing
                        downloadHighResImage(selectedNFT);
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download High Resolution Image
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Keep only the floating filter button for mobile */}
            <div className="md:hidden fixed bottom-6 right-6 z-40">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="default"
                    size="lg"
                    className="rounded-full h-16 w-16 bg-[#f27125] text-black hover:bg-[#f27125]/90 shadow-xl border-2 border-white"
                  >
                    <div className="flex flex-col items-center">
                      <Filter className="h-7 w-7" />
                      <span className="text-xs font-bold mt-1">FILTER</span>
                    </div>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85%] sm:w-[350px] bg-gray-900 border-r border-gray-800 p-0">
                  <SheetHeader className="p-4 border-b border-gray-800 bg-[#f27125]">
                    <SheetTitle className="text-xl font-bold text-black">NFT Filters</SheetTitle>
                  </SheetHeader>
                  <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
                    <div className="space-y-4">
                      {Object.entries(traitCategories).map(([category, values]) => (
                        <div key={category} className="mb-4 border-b border-gray-800 pb-3 last:border-0">
                          <button
                            className="flex items-center justify-between w-full text-left mb-2"
                            onClick={() => toggleCategory(category)}
                          >
                            <h3 className="text-base font-semibold capitalize text-white">{category}</h3>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${expandedCategories[category] ? "rotate-180" : ""}`}
                            />
                          </button>

                          {expandedCategories[category] && (
                            <div className="space-y-2">
                              {sortTraitsByFrequency(category, values).map((value) => (
                                <div key={value} className="flex items-center">
                                  <Checkbox
                                    id={`float-${category}-${value}`}
                                    checked={selectedFilters[category]?.includes(value) || false}
                                    onCheckedChange={() => handleFilterChange(category, value)}
                                    className="border-[#f27125] data-[state=checked]:bg-[#f27125] data-[state=checked]:text-black"
                                  />
                                  <label
                                    htmlFor={`float-${category}-${value}`}
                                    className="ml-2 text-gray-300 hover:text-white cursor-pointer"
                                  >
                                    {value}
                                    <span className="ml-2 text-xs text-gray-500">
                                      ({allNFTs.filter((nft) => nft.traits[category] === value).length})
                                    </span>
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="default" 
                      className="w-full mt-4 bg-[#f27125] text-black hover:bg-[#f27125]/90"
                      onClick={clearFilters}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </>
        )}
      </main>
    </div>
  );
}