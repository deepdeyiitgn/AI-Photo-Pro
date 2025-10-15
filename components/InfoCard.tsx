
import React from 'react';
import { InfoIcon } from './icons';

interface InfoCardProps {
    title: string;
    content: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, content }) => {
    // Basic formatting for the content
    const formattedContent = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .map((line, index) => {
            if (line.startsWith('* ') || line.startsWith('- ')) {
                return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
            }
            return <p key={index} className={index === 0 ? 'font-semibold' : ''}>{line}</p>;
        });

    return (
        <div className="w-full max-w-4xl p-6 bg-base-200 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <InfoIcon />
                {title}
            </h3>
            <div className="text-text-secondary space-y-2">
                {formattedContent}
            </div>
        </div>
    );
};
