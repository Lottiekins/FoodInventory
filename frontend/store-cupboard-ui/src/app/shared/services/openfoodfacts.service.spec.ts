import { TestBed } from '@angular/core/testing';

import { ScanBackendService } from './openfoodfacts.service';

describe('ScanServiceService', () => {
  let service: ScanBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScanBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
