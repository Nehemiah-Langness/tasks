import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEditTasks } from '../../contexts/edit-tasks/useEditTasks';
import { useStorage } from '../../contexts/storage/useStorage';

export function NewTaskButton() {
    const { data } = useStorage();
    const { create } = useEditTasks();

    if (!data) {
        return (
            <div className='skeleton rounded' style={{ width: '7em' }}>
                &nbsp;
            </div>
        );
    }

    return (
        <button
            className='btn btn-link link-success text-decoration-none d-flex align-items-center gap-2 text-nowrap'
            onClick={() => create()}
        >
            <FontAwesomeIcon style={{ fontSize: '1.1em' }} icon={faPlusCircle} /> New Task
        </button>
    );
}
