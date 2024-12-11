import { InvisibleTextarea } from '@components/ui/Inputs/Textarea.tsx';
import { useTranslate } from '../../../contexts/Translator.tsx';
import styles from './Notes.module.less';

export const Notes = () => {
    const { tokens } = useTranslate();
    return (
        <div className={styles.notes}>
            <h1>{tokens.notes.title}</h1>
            <InvisibleTextarea stat={'notes'} />
        </div>
    );
};
