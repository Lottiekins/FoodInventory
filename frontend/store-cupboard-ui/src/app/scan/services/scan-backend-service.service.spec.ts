import { TestBed } from '@angular/core/testing';

import { ScanBackendService } from './scan-backend-service.service';

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
