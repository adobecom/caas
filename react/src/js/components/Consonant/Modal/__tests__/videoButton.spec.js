import React from 'react';
import { mount } from 'enzyme';
import VideoButton from '../videoButton';

// Mock the Modal class
jest.mock('../modal', () => {
  return jest.fn().mockImplementation(() => {
    return { open: jest.fn() };
  });
});

// Mock createPortal to render children directly
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

// Get the mocked modal constructor
const modalMock = require('../modal');

describe('VideoButton Component', () => {
  beforeEach(() => {
    // Add modalContainer for portal rendering
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modalContainer';
    document.body.appendChild(modalContainer);
    
    // Reset window.location and window.open
    delete window.location;
    window.location = { hash: '', href: 'http://localhost/' };
    window.open = jest.fn();
  });

  afterEach(() => {
    // Clean up the DOM
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  it('should render correctly with required props', () => {
    const wrapper = mount(
      <VideoButton
        videoURL="https://example.com/video.mp4"
        className="video-button"
      />
    );

    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(button.prop('className')).toBe('video-button');
  });

  it('should use default props when not provided', () => {
    const wrapper = mount(
      <VideoButton
        videoURL="https://example.com/video.mp4"
        className="video-button"
      />
    );

    const button = wrapper.find('button');
    expect(button.prop('tabIndex')).toBe(0);
  });

  it('should open modal when button is clicked with a regular video URL', () => {
    const wrapper = mount(
      <VideoButton
        videoURL="https://example.com/video.mp4"
        className="video-button"
      />
    );

    expect(wrapper.find('VideoModal').exists()).toBe(false);
    wrapper.find('button').simulate('click');
    wrapper.update();
    
    // Since we use a state update, we need to force update
    expect(wrapper.find('VideoModal').exists()).toBe(true);
    expect(modalMock).toHaveBeenCalled();
  });

  it('should update window.location.hash when clicked with an authored modal URL', () => {
    const wrapper = mount(
      <VideoButton
        videoURL="#modal-id"
        className="video-button"
      />
    );

    wrapper.find('button').simulate('click');
    expect(window.location.hash).toBe('#modal-id');
  });

  it('should open a new window when clicked with a gated video URL', () => {
    const wrapper = mount(
      <VideoButton
        videoURL="https://example.com/video.mp4"
        className="video-button"
        gateVideo={true}
      />
    );

    wrapper.find('button').simulate('click');
    expect(window.open).toHaveBeenCalledWith('https://example.com/video.mp4', '_blank');
  });

  it('should close modal when close handler is triggered', () => {
    const wrapper = mount(
      <VideoButton
        videoURL="https://example.com/video.mp4"
        className="video-button"
      />
    );

    wrapper.find('button').simulate('click');
    wrapper.update();
    
    expect(wrapper.find('VideoModal').exists()).toBe(true);

    // Simulate modal close
    const mockHandleClose = modalMock.mock.calls[0][1].buttonClose;
    mockHandleClose();
    
    wrapper.update();
    expect(wrapper.find('VideoModal').exists()).toBe(false);
  });

  it('should pass correct props to the Modal component', () => {
    const wrapper = mount(
      <VideoButton
        name="custom-modal"
        videoURL="https://example.com/video.mp4"
        className="video-button"
        videoPolicy="autoplay"
      />
    );

    wrapper.find('button').simulate('click');
    wrapper.update();
    
    const modalWindow = wrapper.find('VideoModal');
    expect(modalWindow.exists()).toBe(true);
    expect(modalWindow.prop('name')).toBe('custom-modal');
    expect(modalWindow.prop('videoURL')).toBe('https://example.com/video.mp4');
    expect(modalWindow.prop('videoPolicy')).toBe('autoplay');
  });
});
