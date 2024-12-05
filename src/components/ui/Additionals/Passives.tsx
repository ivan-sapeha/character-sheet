import { passives } from '@components/ui/Statuses/Passives.tsx';

export const PassiveDescr = () => {
    return (
        <div className="flex flex-col gap-[2mm]">
            { passives.map(passive => (
                <div key={ passive.name } className="flex flex-col p-[2mm] border rounded-[2mm] border-gray-800">
                    <div className="flex items-center justify-between border-b-[1px] border-b-gray-800">
                        <span className="flex items-center gap-[2mm]">
                            <span className='h-[10mm]'><img className='h-full aspect-square' src={ passive.img }/> </span>
                            <h1>{ passive.name }</h1>
                        </span>
                    </div>
                    <div className="font-Advent font-light">
                        { passive.description! }
                    </div>
                </div>
            )) }

        </div>
    );
};
