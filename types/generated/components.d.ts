import type { Schema, Struct } from '@strapi/strapi';

export interface SharedAnnouncementItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_announcement_items';
  info: {
    displayName: 'announcement_item';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    date: Schema.Attribute.Date;
    title: Schema.Attribute.String;
  };
}

export interface SharedAnnouncementList extends Struct.ComponentSchema {
  collectionName: 'components_shared_announcement_lists';
  info: {
    displayName: 'announcement_list';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.announcement-item', true>;
    limit: Schema.Attribute.Integer;
  };
}

export interface SharedCarousal extends Struct.ComponentSchema {
  collectionName: 'components_shared_carousals';
  info: {
    displayName: 'carousal';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.carousal-item', true>;
  };
}

export interface SharedCarousalItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_carousal_items';
  info: {
    displayName: 'carousal_item';
  };
  attributes: {
    caption: Schema.Attribute.String;
    link: Schema.Attribute.String;
    media: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface SharedContactWidget extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_widgets';
  info: {
    displayName: 'contact_widget';
  };
  attributes: {
    address: Schema.Attribute.RichText;
    email: Schema.Attribute.Email;
    phone: Schema.Attribute.String;
  };
}

export interface SharedDirectorMessage extends Struct.ComponentSchema {
  collectionName: 'components_shared_director_messages';
  info: {
    displayName: 'director_message';
  };
  attributes: {
    director_name: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    message: Schema.Attribute.RichText;
  };
}

export interface SharedEventsCalendar extends Struct.ComponentSchema {
  collectionName: 'components_shared_events_calendars';
  info: {
    displayName: 'events_calendar';
  };
  attributes: {
    show_upcoming: Schema.Attribute.Integer;
    title: Schema.Attribute.String;
  };
}

export interface SharedFormBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_form_blocks';
  info: {
    displayName: 'form_block';
  };
  attributes: {};
}

export interface SharedGalleryBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_gallery_blocks';
  info: {
    displayName: 'gallery_block';
  };
  attributes: {
    limit: Schema.Attribute.Integer;
    type: Schema.Attribute.Enumeration<['photo', 'video']>;
  };
}

export interface SharedHero extends Struct.ComponentSchema {
  collectionName: 'components_shared_heroes';
  info: {
    displayName: 'hero';
  };
  attributes: {
    background_media: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    cta_label: Schema.Attribute.String;
    cta_url: Schema.Attribute.String;
    headline: Schema.Attribute.String;
    subhead: Schema.Attribute.String;
  };
}

export interface SharedImportantLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_important_links';
  info: {
    displayName: 'important_links';
  };
  attributes: {
    links: Schema.Attribute.Component<'shared.link-item', true>;
  };
}

export interface SharedLinkItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_link_items';
  info: {
    displayName: 'link_item';
  };
  attributes: {
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedNewsList extends Struct.ComponentSchema {
  collectionName: 'components_shared_news_lists';
  info: {
    displayName: 'news_list';
  };
  attributes: {
    limit: Schema.Attribute.Integer;
    title: Schema.Attribute.String;
  };
}

export interface SharedProgramsList extends Struct.ComponentSchema {
  collectionName: 'components_shared_programs_lists';
  info: {
    displayName: 'programs_list';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedStatisticsBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_statistics_blocks';
  info: {
    displayName: 'statistics_block';
  };
  attributes: {
    stats: Schema.Attribute.Component<'shared.statistics-item', true>;
  };
}

export interface SharedStatisticsItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_statistics_items';
  info: {
    displayName: 'statistics_item';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.Integer;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.announcement-item': SharedAnnouncementItem;
      'shared.announcement-list': SharedAnnouncementList;
      'shared.carousal': SharedCarousal;
      'shared.carousal-item': SharedCarousalItem;
      'shared.contact-widget': SharedContactWidget;
      'shared.director-message': SharedDirectorMessage;
      'shared.events-calendar': SharedEventsCalendar;
      'shared.form-block': SharedFormBlock;
      'shared.gallery-block': SharedGalleryBlock;
      'shared.hero': SharedHero;
      'shared.important-links': SharedImportantLinks;
      'shared.link-item': SharedLinkItem;
      'shared.media': SharedMedia;
      'shared.news-list': SharedNewsList;
      'shared.programs-list': SharedProgramsList;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.statistics-block': SharedStatisticsBlock;
      'shared.statistics-item': SharedStatisticsItem;
    }
  }
}
