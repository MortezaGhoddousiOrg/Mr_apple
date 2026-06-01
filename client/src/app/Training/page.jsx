'use client';

import styles from '@/app/Training/page.module.css';
import Image from 'next/image';
import { useState } from 'react';

const fakePhones = [
    { id: 'iphone-15-pro', name: 'iPhone 15 Pro', storage: '256GB', display: '6.1" OLED', chip: 'A17 Pro', battery: '3200 mAh', camera: '48MP', ram: '8GB' },
    { id: 'iphone-15', name: 'iPhone 15', storage: '128GB', display: '6.1" OLED', chip: 'A16', battery: '3349 mAh', camera: '48MP', ram: '6GB' },
    { id: 'iphone-14-pro', name: 'iPhone 14 Pro', storage: '128GB', display: '6.1" OLED', chip: 'A16', battery: '3200 mAh', camera: '48MP', ram: '6GB' },
    { id: 'iphone-13', name: 'iPhone 13', storage: '128GB', display: '6.1" OLED', chip: 'A15', battery: '3227 mAh', camera: '12MP', ram: '4GB' }
];

const fakeNews = [
    { id: 1, title: 'معرفی آیفون جدید', description: 'اپل در مراسم اخیر خود از نسل جدید آیفون با قابلیت‌های هوش مصنوعی رونمایی کرد.', image: '/image-training/iphonesimg.jpg', date: '۱۴۰۳/۰۳/۰۵' },
    { id: 2, title: 'بروزرسانی iOS 18', description: 'قابلیت‌های شخصی‌سازی جدید در راه است و رابط کاربری تغییرات گسترده‌ای را تجربه می‌کند.', image: '/image-training/macbookfourteeninsch.jpg', date: '۱۴۰۳/۰۳/۰۸' },
];

const fakeTutorials = [
    { id: 1, title: 'چگونه باتری آیفون را سالم نگه داریم؟', description: 'در این بخش به بررسی تنظیمات بهینه برای افزایش طول عمر باتری می‌پردازیم.', image: '/image-training/iphonesimg.jpg', date: '۱۴۰۳/۰۳/۱۰' },
    { id: 2, title: 'استفاده حرفه‌ای از دوربین', description: 'ترفندهایی برای عکاسی پرتره و تنظیم نور در شب با دوربین آیفون ۱۵ پرو.', image: '/image-training/macbookfourteeninsch.jpg', date: '۱۴۰۳/۰۳/۱۵' },
];

const getValue = (str) => parseInt(str.replace(/[^0-9]/g, '')) || 0;

export default function Training() {
    const [activeTab, setActiveTab] = useState('آموزش');
    const tabs = ['اخبار', 'آموزش', 'مقایسه'];

    const [phoneAId, setPhoneAId] = useState('iphone-15-pro');
    const [phoneBId, setPhoneBId] = useState('iphone-15');

    const phoneA = fakePhones.find((p) => p.id === phoneAId);
    const phoneB = fakePhones.find((p) => p.id === phoneBId);

    const specsToCompare = ['battery', 'ram', 'storage', 'camera'];
    let scoreA = 0; let scoreB = 0;

    specsToCompare.forEach(key => {
        if (getValue(phoneA[key]) > getValue(phoneB[key])) scoreA++;
        else if (getValue(phoneB[key]) > getValue(phoneA[key])) scoreB++;
    });

    return (
        <div className={styles.page}>
            <header className={styles.trainingHeader}>
                <div className={styles.trainingContent}>
                    <h1 className={styles.trainingTitle}>آموزش و اخبار</h1>
                    <p className={styles.trainingDescription}>دنیای تکنولوژی اپل در دستان شما. از آخرین اخبار تا آموزش‌های تخصصی محصولات برای تجربه بهتر کاربری.</p>
                    
                    <div className={styles.trainingFeatures}>
                        <div className={styles.trainingFeatureItem}>
                            <svg viewBox="0 0 24 24">
                                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                            <span>تیم متخصص محصولات اپل</span>
                        </div>

                        <div className={styles.trainingFeatureItem}>
                            <svg viewBox="0 0 24 24">
                                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                            <span>پشتیبانی سریع و تخصصی</span>
                        </div>
                    </div>
                </div>

                <div className={styles.trainingImageWrapper}>
                    <Image src="/image-infosection/iphonesimg.jpg" alt="Training" width={600} height={600} className={styles.trainingImage} priority />
                </div>
            </header>

            <section className={styles.mainLayout}>
                <aside className={styles.sidebar}>
                    <input className={styles.searchBar} type="text" placeholder="جستجو..." />
                    <nav className={styles.categories}>
                        {tabs.map((tab) => (
                            <button key={tab} className={`${styles.catBtn} ${activeTab === tab ? styles.active : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
                        ))}
                    </nav>
                    {activeTab === 'مقایسه' && (
                        <div className={styles.sidebarCompareTools}>
                            <h4 className={styles.toolTitle}>انتخاب مدل‌ها</h4>
                            <select className={styles.compareSelect} value={phoneAId} onChange={(e) => setPhoneAId(e.target.value)}>
                                {fakePhones.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <select className={styles.compareSelect} value={phoneBId} onChange={(e) => setPhoneBId(e.target.value)}>
                                {fakePhones.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                    )}
                </aside>

                <main className={styles.contentArea}>
                    {(activeTab === 'اخبار' || activeTab === 'آموزش') && (
                        <div className={styles.newsGrid}>
                            {(activeTab === 'اخبار' ? fakeNews : fakeTutorials).map((item) => (
                                <div key={item.id} className={styles.newsCard}>
                                    <div className={styles.newsContent}>
                                        <h3 className={styles.newsTitle}>{item.title}</h3>
                                        <p className={styles.newsDescription}>{item.description}</p>
                                        <span className={styles.newsDate}>{item.date}</span>
                                    </div>
                                    <div className={styles.newsImageWrapper}>
                                        <img src={item.image} alt={item.title} className={styles.newsImage} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'مقایسه' && (
                        <>
                            <div className={styles.compareWrapper}>
                                {[phoneA, phoneB].map((phone, idx) => (
                                    <div key={idx} className={styles.compareColumn}>
                                        <h2 className={styles.compareTitle}>{phone?.name}</h2>
                                        <ul className={styles.specList}>
                                            {['battery', 'ram', 'storage', 'camera', 'chip'].map(key => (
                                                <li key={key} className={styles.specRow}>
                                                    <span className={styles.specLabel}>{key.toUpperCase()}</span>
                                                    <div className={styles.specValueWrapper}>
                                                        <span className={styles.specValue}>{phone[key]}</span>
                                                        {(idx === 0 ? getValue(phoneA[key]) > getValue(phoneB[key]) : getValue(phoneB[key]) > getValue(phoneA[key])) ? <span className={styles.specAdvantage}>✓</span> : <span className={styles.specNeutral} />}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.conclusion}>
                                <h3>نتیجه‌گیری نهایی:</h3>
                                <p>{phoneA.name} دارای {scoreA} برتری و {phoneB.name} دارای {scoreB} برتری است. {scoreA > scoreB ? ` ${phoneA.name} قدرتمندتر است.` : scoreB > scoreA ? ` ${phoneB.name} ارزش خرید بیشتری دارد.` : ' هر دو برابرند.'}</p>
                            </div>
                        </>
                    )}
                </main>
            </section>
        </div>
    );
}
