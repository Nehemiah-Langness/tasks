import { faUmbrellaBeach } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useVacationSettings } from './useVacationSettings';

export function VacationButton() {
    const { editVacation, loaded } = useVacationSettings();

    if (!loaded) {
        return (
            <div className='skeleton rounded ms-lg-auto' style={{ width: '9em' }}>
                &nbsp;
            </div>
        );
    }

    return (
        <button
            className='btn btn-link link-primary ms-lg-auto text-decoration-none d-flex align-items-center gap-2 text-nowrap'
            onClick={editVacation}
        >
            <FontAwesomeIcon style={{ fontSize: '1.1em' }} icon={faUmbrellaBeach} /> Vacation Mode
        </button>
    );
}
