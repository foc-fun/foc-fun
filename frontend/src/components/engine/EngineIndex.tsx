import { useEffect, useState } from "react";
import { hash } from "starknet";

export default function EngineIndex(props: any) {
  const shortenHash = (hash: string) => {
    if (!hash) return "";
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  }

  const [allEvents, setAllEvents] = useState<any[]>([]);
  useEffect(() => {
    if (!props.class || !props.class.data.abi) return;
    const newEvents: any[] = [];
    const entries = Object.entries(props.class.data.abi) as any[];
    for (const [_, entry] of entries) {
      if (entry.kind === "enum" && entry.type === "event") {
        const variants = Object.entries(entry.variants) as any[];
        for (const [_, variant] of variants) {
          const name = variant.name || 'unknown';
          const selector = hash.getSelectorFromName(name);
          // Remove 0x and left pad with 0s to make 64 characters
          const formattedSelector = `${selector.slice(2).padStart(64, '0')}`;
          const type = variant.type || 'unknown';
          newEvents.push({ name, selector: formattedSelector, type });
        }
      }
    }
    setAllEvents(newEvents);
  }, [props.class]);

  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex flex-col">
        <div className="w-full h-1/2 flex flex-col">
          <h2 className="text-lg font-bold">Registered Events</h2>
          {props.events && props.events.data && props.events.data.length > 0 ? (
            <ul className="list-disc list-inside">
              {props.events.data.map((event: any, index: number) => (
                <li key={index} className="text-md">
                  <span className="font-semibold">Event {event.id}:</span>
                  <span className="font-semibold"> {allEvents.find(e => e.selector === event.selector)?.name || 'unknown'}</span>
                  <span className="text-gray-500"> {shortenHash(event.selector)}</span>
                  <span className="text-gray-500"> Type: {allEvents.find(e => e.selector === event.selector)?.type || 'unknown'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">No events registered.</p>
          )}
        </div>
        <div className="w-full h-[2rem] flex flex-col"/>
        <div className="w-full h-1/2 flex flex-col">
          <h2 className="text-lg font-bold">All Events</h2>
          {allEvents && allEvents.length > 0 ? (
            <ul
              className="list-disc list-inside"
              style={{
                backgroundColor: allEvents.some(event => props.events?.data?.some((e: any) => e.selector === event.selector)) ? 'rgba(0, 255, 0, 0.1)' : 'rgba(128, 128, 128, 0.1)'
              }}
            >
              {allEvents.map((event: any, index: number) => (
                <li key={index} className="text-md">
                  <span className="font-semibold">Event:</span>
                  <span className="font-semibold"> {event.name}</span>
                  <span className="text-gray-500"> {shortenHash(event.selector)}</span>
                  <span className="text-gray-500"> Type: {event.type}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">No events found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
